import { Prisma } from "@prisma/client";
import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const maxDuration = 30;

interface locationInfo {
    province:string;
    lgu:string;
    district:string;
}

export async function GET(request:NextRequest, {params}:{params: Promise<locationInfo>}) {
    const region = request?.nextUrl?.searchParams.get("r");
    const province = request?.nextUrl?.searchParams.get("p");
    const lgu = request?.nextUrl?.searchParams.get("l");
    const legislativeDistirct = request?.nextUrl?.searchParams.get("ld");
    const provincialDistrict = request?.nextUrl?.searchParams.get("pd");
    const councilorDistrict = request?.nextUrl?.searchParams.get("cd");

    // validate district counts
    if (/[0-9]+/g.exec(legislativeDistirct ?? "") === null) {
        // not found
        return NextResponse.json("Query parameter `ld` must be a valid integer.", {status: 400})
    }
    console.log(councilorDistrict)
    if (/[0-9]+/g.exec(provincialDistrict ?? "") === null && province !== "null" && region !== "NCR") {
        // not found
        return NextResponse.json("Query parameter `pd` must be a valid integer.", {status: 400})
    }
    if (/[0-9]+/g.exec(councilorDistrict ?? "") === null) {
        // not found
        return NextResponse.json("Query parameter `cd` must be a valid integer.", {status: 400})
    }

    // get local candidates
    const localCandidates = await prisma.local_candidate.findMany({
        where: {
            lgu: lgu,
            province: (region === "NCR" ? null : province)
        }
    });
    
    // get provincial candidates
    const provincialCandidates = await prisma.local_candidate.findMany({
        where: {
            lgu: null,
            province: (province === "NCR" ? null : province)
        }
    });

    // handle LGUs with their own provincial board members
    let provincialBoard;
    if (localCandidates.filter((lc) => lc.position === 'PROVINCIAL BOARD MEMBER').length > 0) provincialBoard = localCandidates.filter(lc => lc.position === 'PROVINCIAL BOARD MEMBER')
    else provincialCandidates.filter((pc) => pc.position === 'PROVINCIAL_COUNCIL' && pc.district == provincialDistrict);

    let localRepresentatives = localCandidates.filter((pc) => pc.position === 'REPRESENTATIVE');

    const representatives = localRepresentatives.length > 0 ? localCandidates.filter((pc) => pc.position === 'REPRESENTATIVE') : provincialCandidates.filter((pc) => pc.position === 'DISTRICT_REPRESENTATIVE' && pc.district == legislativeDistirct);

    return NextResponse.json({
        governors: provincialCandidates.filter((pc) => pc.position === 'GOVERNOR'),
        viceGovernors: provincialCandidates.filter((pc) => pc.position === 'VICE-GOVERNOR'),
        provincialBoard: provincialBoard,
        representatives: representatives.filter((r) => r.district === parseInt(legislativeDistirct ?? "0")),
        mayors: localCandidates.filter((lc) => lc.position === 'MAYOR'),
        viceMayors: localCandidates.filter((lc) => lc.position === 'VICE-MAYOR'),
        councilors: localCandidates.filter((lc) => lc.position === 'COUNCILOR' && lc.district === parseInt(councilorDistrict ?? "1")),
        hasOwnRepresentatives: localCandidates.filter((pc) => pc.position === 'REPRESENTATIVE').length > 0,
        hasOwnProvincialRepresentatives: localCandidates.filter((pc) => pc.position === 'PROVINCIAL_COUNCIL' && pc.district == provincialDistrict).length,
    });
}