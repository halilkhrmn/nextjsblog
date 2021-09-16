import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
//import tr from "javascript-time-ago/locale/tr";
TimeAgo.addDefaultLocale(en);
import ReactTimeAgo from "react-time-ago";

export type PostProps = {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  } | null;
  category: {
    title: string;
    slug: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  const categoryName = post.category ? post.category.title : "xx";
  return (
    <div onClick={() => Router.push("/p/[slug]", `/p/${post.slug}`)} className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
      <div className="col p-4 d-flex flex-column position-static">
        <strong className="d-inline-block mb-2 text-primary">{categoryName}</strong>
        <h3 className="mb-0">{post.title}</h3>
        <div className="mb-1 text-muted">{post.createdAt}</div>
        <p className="card-text mb-auto">{post.description}</p>
        <Link href={"/p/" + post.slug}>
          <a className="stretched-link">Devamını Oku</a>
        </Link>
      </div>
      <div className="col-auto d-none d-lg-block">
        <Image className="bd-placeholder-img" src={"/uploads/" + post.image} alt={post.title} width="200" height="250" />
      </div>
    </div>
  );
};

export default Post;
