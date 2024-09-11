import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma : any = new PrismaClient();

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

    const data = await prisma.Blog.findUnique({
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