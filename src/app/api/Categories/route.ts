import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({
        message: "Unauthorized",
        status: 401,
        success: false,
      });
    }

    const email = session.user.email;

    // Define the type for each item in the categories array
    type CategoryItem = { category: string | null };

    const categories: CategoryItem[] = await prisma.blog.findMany({
      where: {
        email,
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    // Ensure the items in the categories array are typed correctly
    const uniqueCategories = Array.from(
      new Set(
        categories
          .map((item: CategoryItem) => item.category) // Explicitly typing 'item'
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
