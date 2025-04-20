// import prisma from "../../../../../../../lib/prisma";
// import { NextRequest, NextResponse } from "next/server";

// export const maxDuration = 30;

// export async function GET(request:NextRequest) {
//     const province = request?.nextUrl?.searchParams.get("p");
//     const lgu = request?.nextUrl?.searchParams.get("l");
//     const provincialDistrict = request?.nextUrl?.searchParams.get("pd");

//     const localCandidates = await prisma.local_candidate.findMany({
//         where: {
//             lgu: lgu,
//             province: (province === "NCR" ? null : province)
//         }
//     });
    
//     const provincialCandidates = await prisma.local_candidate.findMany({
//         where: {
//             lgu: null,
//             province: (province === "NCR" ? null : province)
//         }
//     });

//     if (localCandidates.filter((lc) => lc.position === 'PROVINCIAL BOARD MEMBER').length > 0) {
//         // city has its own representation in the provincial board
//     }

//     const localRepresentatives = localCandidates.filter((pc) => pc.position === 'REPRESENTATIVE');

//     const representatives = localRepresentatives.length > 0 ? localCandidates.filter((pc) => pc.position === 'REPRESENTATIVE') : provincialCandidates.filter((pc) => pc.position === 'REPRESENTATIVE');

//     // if (localCandidates.filter(lc) => )
//     return NextResponse.json({
//         governors: provincialCandidates.filter((pc) => pc.position === 'GOVERNOR'),
//         viceGovernors: provincialCandidates.filter((pc) => pc.position === 'VICE-GOVERNOR'),
//         provincialBoard: provincialCandidates.filter((pc) => pc.position === 'PROVINCIAL_COUNCIL'),
//         representatives: representatives,
//         mayors: localCandidates.filter((lc) => lc.position === 'MAYOR'),
//         viceMayors: localCandidates.filter((lc) => lc.position === 'VICE-MAYOR'),
//         councilors: localCandidates.filter((lc) => lc.position === 'COUNCILOR'),
//         hasOwnRepresentatives: localCandidates.filter((pc) => pc.position === 'REPRESENTATIVE').length > 0,
//         hasOwnProvincialRepresentatives: localCandidates.filter((pc) => pc.position === 'PROVINCIAL_COUNCIL' && pc.district === provincialDistrict).length,
//     });
// }