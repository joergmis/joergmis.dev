import Head from "next/head";
import { getAllPosts } from "@/lib/api";
import Layout from "@/components/layout";
import Link from "next/link";

export default async function Post({ params }: { params: { slug: string } }) {
  const posts = await getBlogPosts();

  return (
    <Layout>
      <Head>
        <title>Archive</title>
      </Head>

      <p className="max-w-2xl text-3xl tracking-wide leading-12">Archive</p>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-16 py-12">
        {posts.map((post) => (
          <article key={post.slug} className="">
            <div className="space-y-3">
              <Link href={"/blog/" + post.slug}>
                  <h3 className="text-2xl tracking-wide leading-8">
                <h3 className="text-2xl"></h3>{post.title}</h3>
              </Link>
              <p className="text-xs text-gray-600">{post.date}</p>
              <p className="text-sm tracking-wide leading-6">{post.excerpt}</p>
            </div>
          </article>
        ))}
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

  return sorted;
}
