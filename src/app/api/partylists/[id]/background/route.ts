
import { Prisma } from "@prisma/client";
import prisma from "../../../../../../lib/prisma";
import { openai } from "@/lib/openAi";

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

    // check existence of partylist by id
    const partylist = await prisma.partylist.findFirst({
        where: {
            id: {
                equals: id
            }
        }
    });

    if (partylist === null) {
        return Response.json(`partylist with id "${id}" not found.`, {
            status: 400
        });
    }

    // NOTE: check existence of description within DB
    if (partylist.background !== undefined && partylist.background !== null) {
        // simply return existing background
        return Response.json(partylist.background);
    }

    // parse name
    // const splittedName = partylist.name.split(',').reverse();
    // const fullName = (splittedName[0] + " " + splittedName[1]).trim();

    // return Response.json(fullName)
    // if no description within DB, create new one
    console.log("Generating new background...")
    const gptQuery = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role:"user",
                content: `
                Provide a concise background summary on ${partylist.name}, a partylist aiming to gain a seat in the 2025 Philippine Election. in JSON format. 
                Include:
                  - "summary": A brief, 150-word overview listing their political experience and highlighting most known scandals (if any). Do not use flowery language. Do not make inferences about Philippines politics based on them. Be specific on their political experience and scandals.
                - "sources": A list of up-to-date and credible sources (in complete URL) for further reading.
                Ensure the response is in JSON with no extra commentary and no "\`\`\`json" on top. If no information is found, simply return a blank string.
                ​​`
            }
        ],
        store: false
    });

    

    const description = gptQuery.choices[0].message.content;

    // console.log(description)

    if (description === "None" || description === null) {
        // no sufficient information found
        console.log("Background generation failed.")
        return Response.json(`No sufficient information for ${partylist.name}`, {
            status: 404
        });
    }

    try {
        const parsedBackground = JSON.parse(description);
        
        if (parsedBackground.sources.length === 0) {
            return Response.json("Trouble retrieving candidate info. Try again later...", {
                status: 400
            });
        }

        await prisma.partylist.update({
            where: {
                id: partylist.id
            },
            data: {
                background: {
                    summary: parsedBackground.summary,
                    sources: [...parsedBackground.sources] as Prisma.JsonArray
                },
            }
        });

        return Response.json(parsedBackground, {
            status:200
        });
    } catch (err) {
        console.log(err);
        return Response.json(err, {
            status: 400
        });
    }
}