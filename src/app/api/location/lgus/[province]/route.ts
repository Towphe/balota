// import prisma from "../../../../../../lib/prisma";

// export const maxDuration = 30;

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ province: string }> },
// ) {
//   const province = (await params).province;

//   if (province.toLocaleUpperCase() === "NCR") {
//     const lgus = await prisma.lgu_summary.findMany({
//       where: {
//         province_name: null,
//       },
//     });

//     return Response.json({
//       lgus: lgus.sort((a, b) => {
//         if (a.name < b.name) return -1;
//         if (a.name > b.name) return 1;
//         return 0;
//       }),
//       total: lgus.length,
//     });
//   }

//   // get provinces under region
//   const lgus = await prisma.lgu_summary.findMany({
//     where: {
//       province_name: {
//         equals: province,
//       },
//     },
//   });

//   if (lgus.length === 0) {
//     // none found
//     return Response.json("No relevant lgus.", {
//       status: 400,
//     });
//   }

//   const provincialSummary = await prisma.province_summary.findFirst({
//     where: {
//       name: province,
//     },
//   });

//   return Response.json({
//     lgus: lgus,
//     total: lgus.length,
//     totalLegislativeDistricts: provincialSummary?.total_legislative_district,
//     totalProvincialDistricts: provincialSummary?.total_provincial_district,
//   });
// }
