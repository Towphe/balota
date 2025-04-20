
// import { Prisma } from "@prisma/client";
// import prisma from "../../../../../../lib/prisma";
// import { openai } from "@/lib/openAi";
// import { NextResponse } from "next/server";

// const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// export const maxDuration = 30;

// export async function GET(request:Request, {params}:{params: Promise<{id:string}>}) {
//     const id = (await params).id;

//     // check if id is valid guid
//     if (!id.match(uuidPattern)) {
//         return Response.json("Invalid UUID.", {
//             status: 429
//         });
//     }

//     // check existence of partylist by id
//     const partylist = await prisma.partylist.findFirst({
//         where: {
//             id: {
//                 equals: id
//             }
//         }
//     });

//     if (partylist === null) {
//         return Response.json(`partylist with id "${id}" not found.`, {
//             status: 400
//         });
//     }

//     // NOTE: check existence of description within DB
//     if (partylist.background !== undefined && partylist.background !== null) {
//         // simply return existing background
//         return Response.json(partylist.background);
//     }

//     // parse name
//     // const splittedName = partylist.name.split(',').reverse();
//     // const fullName = (splittedName[0] + " " + splittedName[1]).trim();

//     // return Response.json(fullName)
//     // if no description within DB, create new one
//     console.log("Generating new background...")
//     const gptQuery = await openai.chat.completions.create({
//         model: "gpt-4o",
//         messages: [
//             {
//                 role:"user",
//                 content: `
//                 Provide a concise background summary on ${partylist.name}, a partylist aiming to gain a seat in the 2025 Philippine Election. in JSON format. 
//                 Include:
//                 - "summary": A brief, 100-word bio-profile of the partylist. Format as a string.
//                 - "nominees": A list of their nominees for this upcoming 2025 elections. Format as a string array.
//                 - "sources": A list of up-to-date and credible sources (in complete URL) for further reading. Format as a string array with the year embedded at the end of the details.
//                 Ensure the response is in JSON with no extra commentary and no "\`\`\`json" on top. If no information is found for a property, simply mark it as null. Do not use flowery language. Do not make inferences about Philippines politics based on them. Be specific on their political experience and scandals.
//                 ​​`
//             }
//         ],
//         store: false
//     });

    

//     const description = gptQuery.choices[0].message.content;

//     // console.log(description)

//     if (description === "None" || description === null) {
//         // no sufficient information found
//         console.log("Background generation failed.")
//         return Response.json(`No sufficient information for ${partylist.name}`, {
//             status: 404
//         });
//     }

//     try {
//         const parsedBackground = JSON.parse(description);
        
//         if (parsedBackground.sources.length === 0) {
//             return Response.json("Trouble retrieving candidate info. Try again later...", {
//                 status: 400
//             });
//         }

//         await prisma.partylist.update({
//             where: {
//                 id: partylist.id
//             },
//             data: {
//                 background: {
//                     summary: parsedBackground.summary,
//                     sources: [...parsedBackground.sources] as Prisma.JsonArray
//                 },
//             }
//         });

//         return NextResponse.json(parsedBackground, {
//             headers: {
//                 'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
//             }
//         });
//     } catch (err) {
//         console.log(err);
//         return Response.json(err, {
//             status: 400
//         });
//     }
// }