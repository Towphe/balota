
import { Prisma } from "@prisma/client";
import prisma from "../../../../../../lib/prisma";
import { openai } from "@/lib/openAi";
import { NextResponse } from "next/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const maxDuration = 30;

export async function GET(request:Request, {params}:{params: Promise<{id:string}>}) {
    const id = (await params).id;

    // check if id is valid guid
    if (!id.match(uuidPattern)) {
        return Response.json("Invalid UUID.", {
            status: 429
        });
    }

    // check existence of senator by id
    const senator = await prisma.senator.findFirst({
        where: {
            id: {
                equals: id
            }
        }
    });

    if (senator === null) {
        return Response.json(`Senator with id "${id}" not found.`, {
            status: 400
        });
    }

    // NOTE: check existence of description within DB
    if (senator.background !== undefined && senator.background !== null) {
        // simply return existing background
        return Response.json(senator.background);
    }

    // parse name
    const splittedName = senator.name.split(',').reverse();
    const fullName = (splittedName[0] + " " + splittedName[1]).trim();

    // return Response.json(fullName)
    // if no description within DB, create new one
    console.log("Generating new background...")
    const gptQuery = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role:"user",
                content: `
                Provide a concise background summary on ${fullName}, who is running for Senator in the 2025 Philippine Election. in JSON format. 
                Include:
                - "summary": A brief, 100-word bio-profile of the candidate. Format as a string.
                - "career": A list of their past experiences both in politics and outside politics. Highlight those most remarkable. Include the duration as years. Format as a string array.
                - "achievements": A brief list of their most notable political achievements. Be specific on particular laws, and projects. Format as a string array.
                - "scandals": A brief list of their scandals and legal cases. Include when it happened. Only include those that are filed through the legal system. Format as a string array.
                - "sources": A list of up-to-date and credible sources (in complete URL) for further reading. Format as a string array with the year embedded at the end of the details.
                Ensure the response is in JSON with no extra commentary and no "\`\`\`json" on top. If no information is found for a property, simply mark it as null. Do not use flowery language. Do not make inferences about Philippines politics based on them. Be specific on their political experience and scandals.
                ​​`
            }
        ],
        store: false
    });

    

    const description = gptQuery.choices[0].message.content;

    console.log(description)

    // console.log(description)

    if (description === "None" || description === null) {
        // no sufficient information found
        console.log("Background generation failed.")
        return Response.json(`No sufficient information for ${fullName}`, {
            status: 404
        });
    }

    try {
        const parsedBackground = JSON.parse(description);

        if (parsedBackground.summary === undefined) { 
            return Response.json("Trouble retrieving candidate info. Try again later...", {
                status: 400
            });
        }
        
        if (parsedBackground.sources == null || parsedBackground.sources.length === 0) {
            return Response.json("Trouble retrieving candidate info. Try again later...", {
                status: 400
            });
        }

        await prisma.senator.update({
            where: {
                id: senator.id
            },
            data: {
                background: {
                    summary: parsedBackground.summary,
                    career: parsedBackground.career ?? [] as Prisma.JsonArray,
                    achievements: parsedBackground.achievements ?? [] as Prisma.JsonArray,
                    scandals: parsedBackground.scandals ?? [] as Prisma.JsonArray,
                    sources: [...parsedBackground.sources] as Prisma.JsonArray
                },
            }
        })

        return NextResponse.json(parsedBackground, {
            headers: {
                'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
            }
        });
    } catch (err) {
        console.log(err);
        return Response.json(err, {
            status: 400
        });
    }
}