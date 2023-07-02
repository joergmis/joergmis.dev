import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import Layout from "@/components/layout";
import { getAllPosts } from "@/lib/api";
import Link from "next/link";
import Head from "next/head";

export default async function Home() {
  const posts = await getBlogPosts();

  return (
    <Layout>
      <Head>
        <title>Mischa Jörg</title>
      </Head>

      <div className="mb-16">
        <p className="max-w-2xl text-3xl tracking-wide leading-12">
          Software Engineer based in Winterthur, CH. Currently working on an
          embedded project in the building automation space.
        </p>
      </div>

      <div className="">
        <p>Latest posts</p>

        <div className="grid md:grid-cols-3 gap-12 py-12">
          {posts.map((post) => (
            <article key={post.slug} className="">
              <div className="space-y-3">
                <Link href={"/blog/" + post.slug} className="group">
                  <h3 className="text-2xl tracking-wide leading-8">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-xs tracking-wide text-gray-600">
                  {post.date}
                </p>
                <p className="text-sm tracking-wide leading-6">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        <Link href={"/blog"} className="inline-flex text-sm items-center gap-x-2">
          Archive
          <ArrowLongRightIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </Layout>
  );
}

async function getBlogPosts() {
  const all = getAllPosts(["title", "date", "slug", "excerpt"]);

  // sort the posts according to the date
  const sorted = all.sort((n1, n2) => {
    if (n1.date < n2.date) {
      return 1;
    }
    if (n1.date > n2.date) {
      return -1;
    }
    return 0;
  });

  // display only the latest 3 posts
  return sorted.slice(0, 3);
}
