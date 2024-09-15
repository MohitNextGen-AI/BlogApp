"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import React, { useEffect, useState, FormEvent, useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BlogData, BlogDataType } from "@/types/definition";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopButton from "@/components/WebComponents/TopButton";
import { useSession } from "next-auth/react";

export default function ViewBlogsData() {
  const [BlogData, SetBlogData] = useState<BlogDataType[]>([]);
  const [DeleteId, SetDeleteId] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [Searchvalue, Setsearchvalue] = useState<string>("");
  const [Categories, setCategories] = useState<string[]>([]);
  const [CategoriesValue, setCategoriesValue] = useState("All");
  const { data: session } = useSession();
  const email = session?.user.email;

  const ViewBlogs = useCallback(() => {
    axios
      .get(`/api/BlogsPost?limit=1000`)
      .then((res) => {
        const filteredBlogs = res.data.data.filter(
          (value: BlogData) => value.email === email
        );
        SetBlogData(filteredBlogs);
      })
      .catch((error) => {
        console.log("Error fetching blogs:", error);
        toast.error("Error fetching blog data!");
      });
  }, [email]);

  const HandleDelete = () => {
    if (DeleteId) {
      axios
        .delete(`/api/BlogsPost?id=${DeleteId}`)
        .then(() => {
          setOpenAlert(false);
          SetDeleteId(null);
          ViewBlogs(); 
          toast.success("Blog deleted successfully!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error deleting blog!");
        });
    }
  };

  const HandleSearch = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    Setsearchvalue(value);
  };

  useEffect(() => {
    axios
      .get(`api/CategoryPost?query=${CategoriesValue}`)
      .then((res) => {
        SetBlogData(
          res.data.data.filter((value: BlogData) => value.email === email)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [CategoriesValue, email]);

  useEffect(() => {
    ViewBlogs();
    axios
      .get(`/api/CategoriesD`)
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [ViewBlogs]);

  useEffect(() => {
    if (Searchvalue) {
      axios
        .get(`/api/SearchPost?query=${Searchvalue}`)
        .then((res) => {
          SetBlogData(
            res.data.filter((value: BlogData) => value.email === email)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      ViewBlogs();
    }
  }, [Searchvalue, ViewBlogs, email]);

  return (
    <>
      <TopButton />
      <div className="w-full h-screen p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
        {/* search section */}
        <form className="flex items-center justify-between py-4 mb-4">
          <Input
            placeholder="Search Title"
            type="search"
            className="max-w-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            value={Searchvalue}
            onChange={HandleSearch}
          />
          <div className="px-5">
            <select
              className="ml-4 shadow-lg px-3 py-2 rounded-md cursor-pointer"
              onChange={(e) =>
                setCategoriesValue(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
            >
              <option value={"All"}>Categories</option>
              {Categories.map((category, index) => (
                <option
                  className="cursor-pointer px-3 py-2 shadow-md"
                  key={index}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* table section */}
        <div className="rounded-md border bg-white dark:bg-gray-700">
          {!BlogData.length ? (
            <h3 className="text-center font-semibold text-red-600 text-[25px]">
              Data Not Found !
            </h3>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
                  <TableHead>S.No</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {BlogData.map((value: BlogDataType, index: number) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {value.category}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {value.title}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {new Date(value.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {new Date(value.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Link
                              className="w-full text-[15px] bg-orange-500 text-white rounded-md px-3 py-2 font-bold"
                              href={`/Blogs/${value.id}`}
                            >
                              View Full Blog
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Button
                              className="px-3 w-full text-[15px] font-bold"
                              onClick={() => {
                                SetDeleteId(value.id);
                                setOpenAlert(true);
                              }}
                            >
                              Delete
                            </Button>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link
                              href={{
                                pathname: "/CreateBlogs",
                                query: { post: `${value.id}` },
                              }}
                              className="px-3 py-3 w-full text-white bg-orange-500 rounded-md flex  justify-center text-[15px] font-bold"
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* AlertDialog Component */}
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this blog?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={HandleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <ToastContainer />
    </>
  );
}
