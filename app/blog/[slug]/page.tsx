import Head from "next/head";
import { CMS_NAME } from "@/lib/constants";
import PostType from "@/interfaces/post";
import { getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdown";
import PostBody from "@/components/post-body";
import Layout from "@/components/layout";

export default async function Post({ params }: { params: { slug: string } }) {
  const post = (await getBlogPost({
    params: { slug: params.slug },
  })) as PostType;

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

  return (
    <Layout>
      <article className="mb-32">
        <Head>
          <title>{title}</title>
        </Head>

        <h1 className="max-w-2xl text-3xl tracking-wide leading-12">{post.title}</h1>
        <PostBody content={post.content} />
      </article>
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
