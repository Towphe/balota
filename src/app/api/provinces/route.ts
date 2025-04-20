
import { NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  // const region = (await params).region;
  const region = request.nextUrl.searchParams.get("region");

  if (!region) {
    return Response.json("No region indicated.", {
      status: 400
    });
  }

  if (region === "NCR") return Response.json({
    provinces: null,
    total: 0
  });

  // get provinces under region
  const provinces = await prisma.province.findMany({
    where: {
      region: {
        equals: region,
      },
    },
  });


  if (provinces.length === 0) {
    // none found
    return Response.json("No relevant provinces.", {
      status: 400,
    });
  }

  return Response.json({
    provinces: provinces.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }),
    total: provinces.length,
  });
}
