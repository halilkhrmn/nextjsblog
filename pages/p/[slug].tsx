import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Sidebar from "../../components/Sidebar";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import { useSession } from "next-auth/client";
import prisma from "../../lib/prisma";
import moment from "moment";
import Image from "next/image";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      slug: String(params?.slug),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
      category: {
        select: { title: true, slug: true },
      },
    },
  });
  post.createdAt = moment(post.createdAt).format("DD MMM YYYY HH:mm:ss");
  post.updatedAt = moment(post.updatedAt).format("DD MMM YYYY HH:mm:ss");
  return {
    props: post,
  };
};
async function deletePost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}
async function publishPost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  const [session, loading] = useSession();
  if (loading) {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={props.description} />
        <meta property="og:title" content={title} key="title" />
      </Head>
      <main className="container">
        <div className="row g-5">
          <div className="col-md-8">
            <Image className="bd-placeholder-img" src={"/uploads/" + props.image} alt={props.title} layout="responsive" width="100" height="100" />
            <article className="blog-post">
              <h2 className="blog-post-title">{title}</h2>
              <p className="blog-post-meta">
                {props?.createdAt || "xx"} by <a href="#">{props?.author?.name || "Unknown author"}</a>
                Category: {props?.category?.title || "Unknown author"}
              </p>
              <div dangerouslySetInnerHTML={{ __html: props.content }} />
            </article>
            {!props.published && userHasValidSession && postBelongsToUser && <button onClick={() => publishPost(props.id)}>Publish</button>}
            {userHasValidSession && postBelongsToUser && <button onClick={() => deletePost(props.id)}>Delete</button>}
          </div>
          <Sidebar />
        </div>
      </main>
    </Layout>
  );
};

export default Post;
