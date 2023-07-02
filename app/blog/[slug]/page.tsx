import Head from "next/head";
import PostType from "@/interfaces/post";
import { getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdown";
import PostBody from "@/components/post-body";
import Layout from "@/components/layout";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";

export default async function Post({ params }: { params: { slug: string } }) {
  const post = (await getBlogPost({
    params: { slug: params.slug },
  })) as PostType;

  const title = `${post.title}`;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="space-y-3">
        <h1 className="max-w-xl text-3xl tracking-wide leading-12">
          {post.title}
        </h1>
        <p className="text-xs tracking-wide text-gray-600">{post.date}</p>
      </div>

      <PostBody content={post.content} />

      <Link href={"/blog"} className="inline-flex text-sm items-center gap-x-2 mt-16">
        <ArrowLongLeftIcon className="h-5 w-5" aria-hidden="true" />
        Back to the archive
      </Link>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

async function getBlogPost({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);

  const content = await markdownToHtml(post.content || "");

  return {
    ...post,
    content,
  };
}
