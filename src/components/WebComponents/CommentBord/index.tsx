"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import TopButton from "../TopButton";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Comment } from "@/types/definition";
import Image from "next/image";

const formSchema = z.object({
  author: z.string().nonempty(),
  content: z.string().nonempty(),
  email: z.string().nonempty(),
  blogId: z.string().nonempty(),
});

export default function CommentBord() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];
  const [comments, setComments] = useState<Comment[]>([]);
  const [OpenAlert, setOpenAlert] = useState(false);
  const [EditData, SetEditData] = useState<Comment | null>(null);

  const ViewComments = () => {
    axios
      .get(`/api/comments?blogId=${id}`)
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setComments(res.data.data);
        } else {
          console.log("API response data is not an array");
        }
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  };

  useEffect(() => {
    ViewComments();
  }, [id]);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      content: "",
      email: "",
      blogId: id,
    },
  });

  useEffect(() => {
    if (EditData) {
      form.reset({
        author: EditData.author,
        email: '',
        content: EditData.content,
        blogId: id,
      });
    }
  }, [EditData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (EditData) {
        await axios.put(`/api/comments?UpDateComment=${EditData.id}`, values).then((res)=>{
          if(res.data.status==200){
            toast.success("Comment updated successfully!");
          }else{
            toast.error(res.data.message)
          }
        })
       
        SetEditData(null);
      } else {
        await axios.post(`/api/comments`, values);
        toast.success("Comment added successfully!");
      }
  
      ViewComments();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  
    form.reset({
      author: '',
      email: '',
      content: '',
      blogId: id,
    });
  };
  
  

  const HandleDelete = (CommentDelete: String ) => {
    if (CommentDelete) {
      axios
        .delete(`/api/comments?CommentId=${CommentDelete}`)
        .then((res) => {
          ViewComments();
          toast.error(res.data.message)
        })
        .catch((error: unknown) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <TopButton />
      <div className="mt-10">
        <h1 className="lg:text-[25px] sm:txet-[18px] bottom-0 ps-10 font-bold">
          {comments.length} Comments
        </h1>
        {comments.map((value : Comment, index:number) => (
          <div key={index}>
            <Card className="my-10 lg:w-[70%] sm:w-full mx-auto">
              <CardHeader className="p-2">
                <div className="flex justify-between">
                  <div className="flex w-[70%] items-center">
                    <div className="m-2">
                      <Image
                        src="/image/Profile.jpg"
                        width={50}
                        height={50}
                        className="rounded-full"
                        alt="User Avatar"
                      />
                    </div>
                    <div>
                      <CardTitle className="capitalize  font-semibold">
                        <p className="text-[15px] lg:text-[18px]">
                          {value.author}
                        </p>
                      </CardTitle>
                      <CardDescription className="mt-1 font-semibold">
                        {new Date(value.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="my-2">
                          <Button
                            className="hover:border-none"
                            onClick={() => {
                              SetEditData(value);
                              setTimeout(() => {
                                window.scrollTo({
                                  top: document.body.scrollHeight,
                                  behavior: "smooth",
                                });
                              }, 100);
                            }}
                          >
                            <MdOutlineEdit className="text-[20px] font-bold" />
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="my-2">
                          <Button
                            className="hover:border-none"
                            onClick={() => setOpenAlert(true)}
                          >
                            <MdDelete className="text-[20px] font-bold" />
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mx-7">
                <p className="lg:text-[18px] sm:text-[15px] font-semibold capitalize">
                  {value.content}
                </p>
              </CardContent>
            </Card>
            <AlertDialog open={OpenAlert} onOpenChange={setOpenAlert}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your blog post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenAlert(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={() => HandleDelete(value.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
      <div className="w-full bg-orange-500 rounded-sm border-4 my-8 shadow-2xl  lg:p-10 p-2">
        <div className="flex items-center">
          <Image
            src="/image/message_9351583.png"
            width={50}
            height={30}
            alt="not-found"
          />
          <h1 className="lg:text-[35px] text-[17px] text-white ps-10 font-semibold">
            Leave a Reply
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 lg:mt-5"
          >
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="lg:text-[20px] text-[15px] font-bold text-white">
                    Name{" "}
                    <span className="font-bold lg:text-[35px] text-[20px] text-red-500">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Jone Don"
                      className="lg:text-[18px] text-[15px] font-semibold lg:py-3 py-0"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="lg:text-[20px] text-[15px] font-bold text-white">
                    email{" "}
                    <span className="font-bold lg:text-[35px] text-[20px] text-red-500">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="JoneDon@gmail.com"
                      className="lg:text-[18px] text-[15px] font-semibold py-3"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="lg:text-[20px] text-[15px] font-bold text-white">
                    Comment{" "}
                    <span className="font-bold lg:text-[35px] text-[20px] text-red-500">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Leave A Comment....."
                      className="lg:h-[250px] resize-none lg:text-[18px] text-[15px]  font-semibold line-clamp-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-3">
              <Button
                type="submit"
                className="lg:text-[18px] text-[15px] lg:w-[30%] w-full border-4 mt-3"
              >
                Post Comment
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <ToastContainer/>
    </>
  );
}
