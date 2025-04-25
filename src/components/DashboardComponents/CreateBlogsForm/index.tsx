'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Define form schema
const FormSchema = z.object({
  title: z.string().nonempty("Title is required"),
  shotDescriptions: z.string().nonempty("Shot description is required"),
  descriptions: z.string().nonempty("Description is required"),
  category: z.string().nonempty("Category is required"),
  writerName: z.string().nonempty("Writer name is required"),
  image: z.instanceof(File).optional(),
  email: z.string().email("Email is Invalid!"),
});

// Define form data type
type FormData = z.infer<typeof FormSchema>;

export default function CreateBlogsForm() {

  const searchParams = useSearchParams();
  const postId = searchParams.get("post");
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/Sign-in");
  }

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      shotDescriptions: "",
      descriptions: "",
      category: "",
      writerName: "",
      email: session?.user?.email || "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (postId) {
      axios
        .get(`/api/SingleBlog/${postId}`)
        .then((res) => {
          form.reset({
            title: res.data.title || "",
            shotDescriptions: res.data.shotDescriptions || "",
            descriptions: res.data.descriptions || "",
            category: res.data.category || "",
            writerName: res.data.writerName || "",
            image: undefined,
          });
        })
        .catch((error) => console.error("Failed to fetch blog data:", error));
    }
  }, [postId, form]); // Add 'form' to the dependency array

  const handleSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("shotDescriptions", data.shotDescriptions);
    formData.append("descriptions", data.descriptions);
    formData.append("category", data.category.replace(/[^a-zA-Z0-9]/g, ""));
    formData.append("writerName", data.writerName);
    formData.append("email", data.email);

    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      if (postId) {
        await axios.put(`/api/BlogsPost?id=${postId}`, formData)
          .then((res) => {
            toast.success(res.data.message);
            if (res.data.status === 200) {
              router.push("/ViewBlogs");
            }
          });
      } else {
        await axios.post(`/api/BlogsPost`, formData)
          .then((res) => {
            toast.success(res.data.message);
          });
        form.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save blog post.");
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Your Blog Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Blog Title"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-4">
            <FormField
              control={form.control}
              name="shotDescriptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Your Blog Shot Descriptions</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Blog Shot Descriptions"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-4">
            <FormField
              control={form.control}
              name="descriptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Your Blog Descriptions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Blog Descriptions"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Your Blog Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Blog Category"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-4">
            <FormField
              control={form.control}
              name="writerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Blog Writer Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Blog Writer Name"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Writer Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Writer Email"
                      type="email"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Blog Image</FormLabel>
                  <FormControl>
                    <Input
                      className="cursor-pointer"
                      placeholder="Blog Image"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          field.onChange(e.target.files[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-4">
            <Button type="submit" className="w-full">
              {postId ? "Update Blog" : "Create Blog"}
            </Button>
          </div>
        </form>
      </FormProvider>
      <ToastContainer />
    </>
  );
}
