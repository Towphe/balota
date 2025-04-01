import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(request:NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    let count:string|number|null = searchParams.get('c') ?? "10"; // 10 by default
    let page:string|number|null = searchParams.get('p') ?? "1"; // 1 by default
    const name:string|null = searchParams.get('f');
    const sortBy:string|null = searchParams.get('sb') ?? (!name ? "ballot_number" : "ballot_name");
    const order:string|null = searchParams.get('o') ?? 'asc'; //
    let partylists = [];

    try {
        count = parseInt(count); 
        page = parseInt(page);
    } catch {
        return new Response("Invalid count and/or page query parameters", {
            status: 400            
        });
    }

    if (order != 'asc' && order != 'desc') {
        return Response.json(`Invalid order type "${order}".`, {
            status: 400
        });
    }

    const precedence = [];
    switch (sortBy) {
        case "ballot_name":
            precedence.push({
                ballot_name: order
            });
            break;
        case "ballot_number":
            precedence.push({
                ballot_number: order
            });
            break;
        case "name":
            precedence.push({
                name: order
            });
            break;
        default:
            return Response.json(`Invalid sortBy value "${sortBy}"`, {
                status: 400
            });
            break;
    }

    partylists = await prisma.partylist.findMany({
        skip: count*(page-1),
        take: count,
        where: {
            ...(name && {ballot_name: { contains: name, mode: 'insensitive' }}),
        },
        orderBy: {
            ...(sortBy === 'ballot_name' && {ballot_name: order}),
            ...(sortBy === 'ballot_number' && {ballot_number: order}),
            ...(sortBy === 'name' && {name: order}),
        }
    });

    const total = await prisma.partylist.count({
        where: {
            ...(name && {ballot_name: { contains: name, mode: "insensitive" }}),
        },
        orderBy: {
            ...(sortBy === 'ballot_name' && {ballot_name: order}),
            ...(sortBy === 'ballot_number' && {ballot_number: order}),
            ...(sortBy === 'name' && {name: order}),
        }
    });

    return NextResponse.json({
        partylists: partylists,
        total: total
    }, {
        headers: {
            'Cache-Control': 's-maxage=60, stale-while-revalidate=30'
        }
    });
}