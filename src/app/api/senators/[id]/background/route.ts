
import prisma from "../../../../../../lib/prisma";
import { openai } from "@/lib/openAi";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
        model: "gpt-4o-mini",
        messages: [
            {
                role:"assistant",
                content: `Output a brief background about 2025 Philippine Elections Senatorial Candidate ${senator.ballot_name}. Highlight past political experience and scandals, if any. Pass each paragraph to a flat "descriptions" JSON array. Provide sources to a flat "sources" JSON array as well. Final output should be in JSON without header. If none is found, simply return string "None"​​`
            }
        ],
        store: false
    });

    const description = gptQuery.choices[0].message.content;

    if (description === "None" || description === null) {
        // no sufficient information found
        console.log("Background generation failed.")
        return Response.json(`No sufficient information for ${fullName}`, {
            status: 404
        });
    }

    try {
        const parsedBackground = JSON.parse(description);
        console.log(parsedBackground.sources.length === 0)
        if (parsedBackground.sources.length === 0) {
            return Response.json("Trouble retrieving candidate info. Try again later...", {
                status: 400
            });
        }

        // save parsedBackground to db
        await prisma.senator.update({
            where: {
                id: senator.id
            },
            data: {
                background: {
                    descriptions: [
                      "Abby Binay is a political figure in the Philippines affiliated with the Nationalist People's Coalition (NPC). She is set to run in the 2025 Philippine Senate elections, continuing her family’s political legacy.",
                      "Abby Binay previously served as the mayor of Makati City and as a councilor. Her tenure as mayor was marked by initiatives aimed at improving social services and community welfare in the city.",
                      "While she has maintained a relatively low profile compared to other political figures, Abby Binay has faced some controversies linked to her family's political standing, particularly regarding allegations of corruption involving her father, former Vice President Jejomar Binay, during his tenure in local government."
                    ],
                    sources: [
                      "https://news.abs-cbn.com/news/10/18/21/abby-binay-expected-to-run-for-senate",
                      "https://www.philstar.com/headlines/2022/06/30/2190623/abby-binay-sworn-makati-city-mayor",
                      "https://www.rappler.com/nation/263838-jejomar-binay-abby-binay-graft-case-update/"
                    ]
                  }
            }
        });

        return Response.json(parsedBackground, {
            status:200
        });
    } catch (err) {
        // console.log(err);
        return Response.json(err, {
            status: 400
        });
    }
}