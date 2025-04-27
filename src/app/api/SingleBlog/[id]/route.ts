
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, context: any) => {
  const { params } = context;

  if (!params || !params.id) {
    return NextResponse.json({ message: "ID is missing!" }, { status: 400 });
  }

  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID format!" }, { status: 400 });
    }

    const data = await prisma.blog.findUnique({
      where: {
        id: id,
      },
    });

    if (!data) {
      return NextResponse.json({ message: "Data not found!" }, { status: 404 });
    }
    
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data!", error: error },
      { status: 500 }
    );
  }
};