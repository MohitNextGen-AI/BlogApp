
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';



export const GET = async (request : NextRequest) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("query")?.trim() || "";

  if (!category) {
    return NextResponse.json(
      { message: 'Invalid category ID' },
      { status: 400 }
    );
  }

  try {
    
    // Fetch posts with the specified category
    if(category === 'All'){
        const posts = await prisma.blog.findMany();
        return NextResponse.json(
          { data: posts, success: true },
          { status: 200 }
        );
    }else{
       const posts = await prisma.blog.findMany({
        where: {
          category: {
            equals: category,
            mode: 'insensitive', // Case-insensitive search
          },
        },
      });
      return NextResponse.json(
        { data: posts, success: true },
        { status: 200 }
      );
    }
   
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return NextResponse.json(
      { message: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
};
