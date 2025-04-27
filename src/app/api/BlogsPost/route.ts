import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from "uuid";
import { db } from '@/lib/db';

// GET Blogs API
export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const skip = (page - 1) * limit;

  try {
    const data = await db.blog.findMany({
      skip: skip,
      take: limit,
    });

    const totalItems = await db.blog.count();
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
      status: 200,
      success: true,
    });
  } catch (error : any) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
  }
};

// POST Blog API
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const title = formData.get('title')?.toString();
    const descriptions = formData.get('descriptions')?.toString();
    const category = formData.get('category')?.toString().replace(/[^a-zA-Z0-9]/g, '');
    const shotDescriptions = formData.get('shotDescriptions')?.toString();
    const writerName = formData.get('writerName')?.toString();
    const image = formData.get('image') as File;
    const email = formData.get('email')?.toString();

    if (!title || !shotDescriptions || !descriptions || !category || !writerName || !image || !email) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imageName = `${uuidv4()}-${image.name}`;
    const imagePath = path.join(uploadDir, imageName);

    const buffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, buffer);

    const newBlog = await db.blog.create({
      data: {
        title,
        shotDescriptions,
        descriptions,
        category,
        writerName,
        image: `/uploads/${imageName}`,
        email
      },
    });

    return NextResponse.json({ message: 'Blog Created Successfully!', blog: newBlog, status: 201, success: true });

  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ message: 'An error occurred', error: error.message }, { status: 500 });
  }
};
// PUT (Update) Blog API
export const PUT = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? parseInt(idParam) : null;

    if (!id) {
      return NextResponse.json({
        message: "Invalid ID provided",
        status: 400,
        success: false,
      });
    }

    const formData = await request.formData();
    const title = formData.get("title")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const writerName = formData.get("writerName")?.toString() || "";
    const shotDescriptions = formData.get("shotDescriptions")?.toString() || "";
    const descriptions = formData.get("descriptions")?.toString() || "";
    const email = formData.get("email")?.toString() || "";

    const imageFile = formData.get("image") as File | null;
    let imagePath = "";

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      imagePath = `${uuidv4()}-${imageFile.name}`;
      const filePath = path.join(uploadDir, imagePath);
      fs.writeFileSync(filePath, buffer);
    }

    const updatedPost = await db.blog.update({
      where: { id },
      data: {
        title,
        category,
        writerName,
        shotDescriptions,
        descriptions,
        image: imagePath || undefined,
        email
      },
    });

    return NextResponse.json({
      message: "Blog Updated Successfully!",
      status: 200,
      success: true,
      data: updatedPost,
    });

  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json({
      message: `Something went wrong: ${error.message}`,
      status: 500,
      success: false,
    });
  }
};
// DELETE Blog API
export const DELETE = async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? parseInt(idParam, 10) : null; // Ensure radix parameter for parseInt

    if (!id) {
      return NextResponse.json({
        message: "Invalid ID provided",
        status: 400,
        success: false,
      });
    }


    const result = await db.$transaction(async (tx:any) => {

      const deleteCommentsResult = await tx.comment.deleteMany({
        where: { blogId: id }, 
        
      });


      const deleteBlogResult = await tx.blog.delete({
        where: { id },
      });


      return {
        message: "Blog deleted successfully!",
        status: 200,
        success: true,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error during deletion:", error);
    return NextResponse.json({
      message: "An error occurred while deleting the blog",
      status: 500,
      success: false,
    });
  }
};
