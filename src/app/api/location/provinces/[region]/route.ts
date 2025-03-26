

import prisma from "../../../../../../lib/prisma";

export const maxDuration = 30;

export async function GET(request:Request, {params}:{params: Promise<{region:string}>}) {
    const region = (await params).region;

    // get provinces under region
    const provinces = await prisma.province_summary.findMany({
        where: {
            region: {
                equals: region
            }
        },
        
    })

    if (provinces.length === 0) {
        // none found
        return Response.json("No relevant provinces.", {
            status: 400
        });
    }

    return Response.json({
        provinces: provinces,
        total: provinces.length
    });
}