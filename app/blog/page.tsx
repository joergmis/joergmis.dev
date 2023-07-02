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

      <p>Archive</p>

      <div className="md:grid grid-cols-3 gap-12 py-12">
        {posts.map((post) => (
          <article key={post.slug} className="">
            <div className="space-y-3">
              <Link href={"/blog/" + post.slug}>
                <h3 className="text-2xl">{post.title}</h3>
              </Link>
              <p className="text-xs text-gray-600">{post.date}</p>
              <p className="text-sm">{post.excerpt}</p>
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
