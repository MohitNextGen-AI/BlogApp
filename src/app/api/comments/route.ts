import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";


export async function POST(request: Request) {
  try {
    const { author, content, email, blogId } = await request.json();

    if (isNaN(Number(blogId))) {
      return NextResponse.json(
        { error: "Invalid Blog ID", status: 400 },
        { status: 400 }
      );
    }

    const existingComment = await prisma.comment.findFirst({
      where: {
        email,
        blogId: Number(blogId),
      },
    });

    if (existingComment) {
      return NextResponse.json(
        { status: 401, message: "You have already commented on this blog!" }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        author,
        content,
        email,
        blog: {
          connect: { id: Number(blogId) },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Comment successfully created!",
    });
  } catch (error: any) {
    console.error("Error processing request:", error.message || error);
    return NextResponse.json(
      { error: "Unable to process request", details: error.message || error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        blogId: Number(blogId),
      },
    });

    return NextResponse.json({
      data: comments,
      status: 200,
      message: "Comments fetched successfully!",
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error.message || error);
    return NextResponse.json(
      { error: "Unable to fetch comments", details: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const CommentId = searchParams.get("CommentId");

  if (!CommentId) {
    return NextResponse.json(
      { error: "Comment ID is required" },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.delete({
      where: {
        id: Number(CommentId),
      },
    });

    return NextResponse.json({
      data: comments,
      status: 200,
      message: "Comments Delted successfully!",
    });
  } catch (error: any) {
    console.error("Error fetching comments:", error.message || error);
    return NextResponse.json(
      { error: "Unable to fetch comments", details: error.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const UpdateId = searchParams.get("UpDateComment");

  if (!UpdateId) {
    return NextResponse.json({ message: "Comment Id is required", status: 400 });
  }

  try {

    const body = await request.json();
    const { content , email } = body;

    if (!content) {
      return NextResponse.json({ message: "Comment content is required", status: 400 });
    }


    const parsedId = parseInt(UpdateId, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ message: "Invalid Comment Id", status: 400 });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: parsedId },
    });

    if (!comment) {
      return NextResponse.json({ message: "Comment not found", status: 404 });
    }

    if (email !== comment.email) {
      return NextResponse.json({ status: 400, message: "Invalid Email!" });
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: parsedId,
      },
      data: { content },
    });

    if (!updatedComment) {
      return NextResponse.json({
        message: "Comment not found or update failed",
        status: 404,
      });
    }

    return NextResponse.json({
      data: updatedComment,
      message: "Comment successfully updated!",
      status: 200,
    });

  } catch (error: any) {
    console.log("Update Error:", error.message);
    return NextResponse.json({ message: error.message, status: 500 });
  }
}