"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlogData } from "@/types/definition";
import Link from "next/link";
import TopButton from "../TopButton";
import Image from "next/image";

export default function FindCategorise() {
  const [categories, setCategories] = useState<string[]>([]);
  const [postValue, setPostValue] = useState<string>("All");
  const [postData, setPostData] = useState<BlogData[]>([]);

  useEffect(() => {
    axios
      .get(`/api/Categories`)
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/api/CategoryPost?query=${postValue}`)
      .then((res) => {
        setPostData(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [postValue]);

  return (
    <div className="container mx-auto px-4 py-8">
      <TopButton />
      <Tabs defaultValue="All" className="px-4">
        <TabsList className="flex justify-between  overflow-auto  space-x-4 mb-6 py-8 overflow-y-hidden">
          <TabsTrigger
            className="px-4 mx-4 py-2 capitalize bg-orange-500 text-white text-[16px] rounded-md transition-colors hover:bg-orange-600 focus:outline-none"
            onClick={() => setPostValue("All")}
            value="All"
          >
            All Posts
          </TabsTrigger>
          {categories.map((category, index) => (
            <TabsTrigger
              key={index}
              className="px-4 py-2 flex capitalize bg-orange-500 text-white text-[16px] rounded-md transition-colors hover:bg-orange-600 focus:outline-none"
              onClick={() => setPostValue(category)}
              value={category}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="All">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {postData.map((post, i) => {
              const imageUrl = post.image.startsWith("/public")
                ? post.image.slice(7)
                : post.image;

              return (
                <div className="card" key={i}>
                  <Link href={`/Blogs/${post.id}`}>
                    <Card className="h-full bg-white shadow-md rounded-lg overflow-hidden">
                      <CardHeader>
                        <Image
                        width={500}
                        height={500}
                          className="w-full h-auto object-cover"
                          src={imageUrl}
                          alt={post.title}
                        />
                        <CardTitle className="text-xl font-semibold mt-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {post.shotDescriptions}
                          </p>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Link
                          href={`/Blogs/${post.id}`}
                          className="text-sm bg-orange-500 text-white rounded-md px-3 py-2 font-bold"
                        >
                          Read Full Blog
                        </Link>
                      </CardFooter>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </TabsContent>
        {categories.map((category, index) => (
          <TabsContent key={index} value={category}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postData.map((post, i) => {
                const imageUrl = post.image.startsWith("/public")
                  ? post.image.slice(7)
                  : post.image;

                return (
                  <div className="card" key={i}>
                    <Link href={`/Blogs/${post.id}`}>
                      <Card className="h-full bg-white shadow-md rounded-lg overflow-hidden">
                        <CardHeader>
                          <Image
                            className="w-full h-auto object-cover"
                            src={imageUrl}
                            alt={post.title}
                            width={500}
                            height={500}
                          />
                          <CardTitle className="text-xl font-semibold mt-2">
                            {post.title}
                          </CardTitle>
                          <CardDescription>
                            <p className="text-sm line-clamp-2">
                              {post.shotDescriptions}
                            </p>
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Link
                            href={`/Blogs/${post.id}`}
                            className="text-sm bg-orange-500 text-white rounded-md px-3 py-2 font-bold"
                          >
                            Read Full Blog
                          </Link>
                        </CardFooter>
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
