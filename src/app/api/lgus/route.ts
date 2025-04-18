
import { NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
    const region = request.nextUrl.searchParams.get("region");
    const province = request.nextUrl.searchParams.get("province");

    if (!region) {
        return Response.json("Region not indicated", {status: 400});
    }

    let lgus = [];

    if (region == "NCR") {
        // handle NCR
        lgus = await prisma.lgu.findMany({
            where: {
                region: {
                    equals: region,
                },
            },
        });
    } else {
        lgus = await prisma.lgu.findMany({
            where: {
                region: {
                    equals: region,
                },
                province_name: {
                    equals: province
                }
            },
        });
    }


    if (lgus.length === 0) {
        // none found
        return Response.json("No relevant lgus.", {
        status: 400,
        });
    }

    return Response.json({
        lgus: lgus.sort((a, b) => {
        if (a.lgu < b.lgu) return -1;
        if (a.lgu > b.lgu) return 1;
        return 0;
        }),
        total: lgus.length,
    });
}
