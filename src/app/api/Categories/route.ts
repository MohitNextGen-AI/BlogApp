import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Fetch categories from the database with explicit typing
    const categories = await prisma.blog.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    // Ensure the items in the categories array are typed correctly
    const uniqueCategories = Array.from(
      new Set(
        categories
          .map((item: { category: string | null }) => item.category) // Explicitly type 'item'
          .filter((category): category is string => {
            return typeof category === "string" && category.trim() !== "";
          })
          .map((category) => category.trim().toLowerCase())
      )
    );

    return NextResponse.json({
      data: uniqueCategories,
      status: 200,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching unique categories:", error);
    return NextResponse.json({
      message: `Something went wrong: ${error instanceof Error ? error.message : String(error)}`,
      status: 500,
      success: false,
    });
  }
}
