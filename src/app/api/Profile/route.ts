import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const {
    username,
    password,
    email,
    instagramurl,
    facebookurl,
    twitterurl,
    youtubeurl,
    profileSummry,
    phonenumber,
    userphoto,
    totalpost,
  } = body;

  try {

    const existingUser = await prisma.profile.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return NextResponse.json({
          status: 409, 
          message: "Email is already registered.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

    if (!username || !password || !email) {
      return NextResponse.json({ status: 400, message: "data is not found!" });
    }

 

    const profileData = await prisma.profile.create({
      data: {
        username,
        password : hashedPassword,
        email,
        instagramurl: instagramurl || null,
        facebookurl: facebookurl || null,
        twitterurl: twitterurl || null,
        youtubeurl: youtubeurl || null,
        profileSummry: profileSummry || null,
        phonenumber: phonenumber || null,
        userphoto: userphoto || null,
        totalpost: totalpost || null,
      },
    });

    return NextResponse.json({
      data: profileData,
      message: "User registered successfully!",
      status: 200,
    });
  } catch (error: any) {
    console.error("Error creating profile:", error); 
    return NextResponse.json({
      status: 500,
      message: "An error occurred while registering the user.",
      details: error.message,
    });
  }
};

export const GET = async  (request : NextRequest) =>{
    try{

        const profileData = await prisma.profile.findMany()

        return NextResponse.json({
            status : 200  ,
            message : "Pofile is Get sucssefully !",
            data : profileData
        })

    }catch(error : any){
        return NextResponse.json({
            status : 500 ,
            message : error.message
        })
    }
}

export const PUT = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const instagramurl = formData.get("instagramurl")?.toString() || "";
    const facebookurl = formData.get("facebookurl")?.toString() || "";
    const twitterurl = formData.get("twitterurl")?.toString() || "";
    const youtubeurl = formData.get("youtubeurl")?.toString() || "";
    const profileSummry = formData.get("profileSummry")?.toString() || "";
    const phonenumber = formData.get("phonenumber")?.toString() || "";
    const totalpost = parseInt(formData.get("totalpost")?.toString() || "0", 10);

    let imagePath = "";
    const userphoto = formData.get("userphoto") as File;

    if (userphoto && userphoto instanceof Blob) {
      console.log("Received file:", userphoto.name);
      const arrayBuffer = await userphoto.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join(process.cwd(), "public", "profileimages");
      console.log("Upload directory:", uploadDir);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      imagePath = path.join(uploadDir, `${uuidv4()}-${userphoto.name}`);
      console.log("Saving file to:", imagePath);

      fs.writeFileSync(imagePath, buffer);
      imagePath = `/profileimages/${path.basename(imagePath)}`;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingProfile = await prisma.profile.findUnique({
      where: { email },
    });

    if (!existingProfile) {
      return NextResponse.json({
        status: 404,
        message: "This profile is not found in our database!",
      });
    }

    const profileUpdateData = await prisma.profile.update({
      where: { email },
      data: {
        username,
        password: hashedPassword,
        email,
        instagramurl,
        facebookurl,
        twitterurl,
        youtubeurl,
        profileSummry,
        phonenumber,
        userphoto: imagePath || undefined,
        totalpost,
      },
    });

    return NextResponse.json({
      message: "Your Profile is updated successfully!",
      status: 200,
      data: profileUpdateData,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({
      status: 500,
      message: "Something went wrong!",
      details: error.message,
    });
  }
};