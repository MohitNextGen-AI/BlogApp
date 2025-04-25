import Image from "next/image";
import Link from "next/link";
import { db } from "../lib/db";
import { Blog } from "@prisma/client";

async function getFeaturedBlogs() {
  const blogs = await db.blog.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc'
    }
  });
  return blogs;
}

export default async function Home() {
  const featuredBlogs = await getFeaturedBlogs();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Discover Amazing Stories
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Explore our collection of insightful blogs across various categories
          </p>
          <Link 
            href="/Blogs" 
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-100 transition-colors"
          >
            Explore Blogs
          </Link>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBlogs.map((blog: Blog) => (
            <Link 
              href={`/Blogs/${blog.id}`} 
              key={blog.id}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-48">
                  <Image
                    src={blog.image || "/image/blog.jpeg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-500">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {blog.shotDescriptions}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      By {blog.writerName}
                    </span>
                    <span className="text-sm text-orange-500">
                      {blog.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Technology', 'Lifestyle', 'Travel', 'Food'].map((category) => (
              <Link
                href={`/Blogs?category=${category}`}
                key={category}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-orange-500 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Share Your Story?</h2>
          <p className="text-xl mb-8">
            Join our community of writers and start sharing your experiences with the world.
          </p>
          <Link
            href="/Sign-up"
            className="inline-block bg-white text-orange-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-100 transition-colors"
          >
            Start Writing
          </Link>
        </div>
      </section>
    </main>
  );
}
