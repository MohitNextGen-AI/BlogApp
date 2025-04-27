"use client";
import { Profile, profileName } from "@/types/definition";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../Loadingspinner";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from 'react';

export  const  ProfileViewPort : any =  ()=> {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const email = session?.user?.email;
      if (!email) return;

      try {
        const res = await axios.get(`/api/Profile`);
        const Profiles = res.data.data.filter((value: Profile) => value.email === email);
        setProfileData(Profiles[0]);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Something went wrong!");
      }
    };

    fetchData();
  }, [session]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }


  const imageUrl = profileData?.userphoto?.startsWith('/profileimages')
  ? profileData.userphoto
  : profileData?.userphoto;

  console.log(imageUrl);

  if (!profileData) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="w-full overflow-hidden dark:bg-gray-900">
        <div className="flex flex-col">
          <Image
            width={500}
            height={800}
            src="/image/ProfileBack.jpg"
            alt="User Cover"
            className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[16rem] sm:h-[14rem] xs:h-[11rem]"
          />

          <div className="sm:w-[80%] xs:w-[90%] mx-auto flex">
            <Image
              width={500}
              height={800}
              src={imageUrl || "/image/Profile.jpg"}
              alt="User Profile"
              className="rounded-md lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] sm:w-[8rem] sm:h-[8rem] xs:w-[7rem] xs:h-[7rem] outline outline-2 outline-offset-2 outline-blue-500 relative lg:bottom-[5rem] sm:bottom-[4rem] xs:bottom-[3rem]"
            />
            <h1 className="w-full text-left my-4 sm:mx-4 xs:pl-4 text-gray-800 dark:text-white lg:text-4xl md:text-3xl sm:text-3xl xs:text-xl font-serif">
              {profileData.username}
            </h1>
          </div>

          <div className="xl:w-[80%] lg:w-[90%] md:w-[90%] sm:w-[92%] xs:w-[90%] mx-auto flex flex-col gap-4 items-center relative lg:-top-8 md:-top-6 sm:-top-4 xs:-top-4">
            <p className="w-fit capitalize text-gray-700 dark:text-gray-400 text-md">
              {profileData.profileSummry}
            </p>

            <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
              <div className="w-full flex sm:flex-row xs:flex-col gap-2 justify-center">
                <div className="w-full">
                  <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                    <div className="flex flex-col pb-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Name
                      </dt>
                      <dd className="text-lg font-semibold">{profileData.username}</dd>
                    </div>
                    <div className="flex flex-col py-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Email
                      </dt>
                      <dd className="text-lg font-semibold">{profileData.email}</dd>
                    </div>
                    <div className="flex flex-col py-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Total Blogs Post
                      </dt>
                      <dd className="text-lg font-semibold"> {profileData.totalpost} </dd>
                    </div>
                    <div className="flex flex-col py-3">
                      <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                        Phone Number
                      </dt>
                      <dd className="text-lg font-semibold"> {profileData.phonenumber} </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="fixed right-2 bottom-20 flex flex-col rounded-sm bg-gray-200 text-gray-500 dark:bg-gray-200/80 dark:text-gray-700 hover:text-gray-600 hover:dark:text-gray-400">
              <Link href={profileData.instagramurl || "/"}>
                <div className="p-2 hover:text-primary hover:dark:text-primary">
                  <Image src="/image/instagram_2111463.png" width={25} height={20} alt="not-found" />
                </div>
              </Link>
              <Link href={profileData.twitterurl || "/"}>
                <div className="p-2 hover:text-primary hover:dark:text-primary">
                  <Image src="/image/letter-x_9862814 (1).png" width={25} height={20} alt="not-found" />
                </div>
              </Link>
              <Link href={profileData.facebookurl || '/'}>
                <div className="p-2 hover:text-blue-500 hover:dark:text-blue-500">
                  <Image src="/image/facebook_5968764.png" width={25} height={20} alt="not-found" />
                </div>
              </Link>
              <Link href={profileData.youtubeurl || '/'}>
                <div className="p-2 hover:text-primary hover:dark:text-primary">
                  <Image src="/image/youtube_3938026.png" width={25} height={20} alt="not-found" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
}
