
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';


export const GET = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";

    const results = await db.blog.findMany({
      where: {
        title: {
          contains: query.trim(),
          mode: 'insensitive',
        },
      },
    });

    return NextResponse.json(results);
  } catch (error : unknown) {
    console.error("Error in search API:", error); // Added logging for debugging
    return NextResponse.json({
      message: `Something went wrong: ${error}`,
      status: 500,
      success: false,
    });
  }
};

