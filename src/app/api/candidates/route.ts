
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { Candidate } from "@/models/Candidate";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
    const lguId = request.nextUrl.searchParams.get("lgu_id");

    // return national positions (senators and partylists)
    const nationalPositions = await prisma.candidate.findMany(
        {
            where: {
                OR: [
                    {position: "SENATOR"},
                    {position: "PARTYLIST"}
                ]
            },
            orderBy: [{ballot_number: "asc"}, {position: "desc"}]
        }
    )

    // return senators and partylists immediately
    if (!lguId) {
        return NextResponse.json({
            senators: nationalPositions.filter(np => np.position === "SENATOR"),
            partylists: nationalPositions.filter(np => np.position === "PARTYLIST"),
        });
    }

    // check existence of lgu
    const lgu = await prisma.lgu.findFirst({
        where: {
            lgu_id: lguId
        }
    });
    if (!lgu) {
        return NextResponse.json("Non-existent LGU", {status: 400});
    }

    let provincialCandidates:Candidate[] = [];
    // retrieve provincial positions
    if (lgu.province_id) {
        provincialCandidates = await prisma.candidate.findMany({
            where: {
                AND: [
                    {province_id: lgu.province_id},
                    {lgu_id: null}
                ]
            }
        });
    }

    // retrieve local positions
    const localCandidates:Candidate[] = await prisma.candidate.findMany({
        where: {
            lgu_id: lguId
        }
    });

    return NextResponse.json({
        senators: nationalPositions.filter(np => np.position === "SENATOR"),
        partylists: nationalPositions.filter(np => np.position === "PARTYLIST"),
        governors: provincialCandidates.filter(pc => pc.position === "PROVINCIAL GOVERNOR"),
        viceGovernors: provincialCandidates.filter(pc => pc.position === "PROVINCIAL VICE-GOVERNOR"),
        provincialBaordMembers: localCandidates.filter(pc => pc.position === "MEMBER, SANGGUNIANG PANLALAWIGAN"),
        representatives: localCandidates.filter(pc => pc.position === "MEMBER, HOUSE OF REPRESENTATIVES"),
        mayors: localCandidates.filter(pc => pc.position === "MAYOR"),
        viceMayors: localCandidates.filter(pc => pc.position === "VICE-MAYOR"),
        lguCouncil: localCandidates.filter(pc => pc.position === "LGU_COUNCIL"),
        barmmRep: localCandidates.filter(pc => pc.position === "BARMM PARTY REPRESENTATIVES"),
        barmmParliament: localCandidates.filter(pc => pc.position === "BARMM MEMBERS OF THE PARLIAMENT")
    });
}