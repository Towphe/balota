
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export const maxDuration = 30;

export async function GET(request:NextRequest, {params}:{params: Promise<{lgu:string}>}) {
    const province = request?.nextUrl?.searchParams.get("p");
    const lgu = request?.nextUrl?.searchParams.get("l");

    const candidatesCount = await prisma.local_candidate.count({
        where: {
            position: {
                equals: "PROVINCIAL BOARD MEMBER"
            },
            lgu: {
                equals: lgu
            },
            province: {
                equals: province
            }
        }
    });

    return NextResponse.json({
        hasOwnProvincialRep: candidatesCount > 0
    }, {status: 200});
}