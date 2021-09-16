import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import Post, { PostProps } from "../components/Post";
import prisma from "../lib/prisma";
import moment from "moment";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
      category: {
        select: { title: true, slug: true },
      },
    },
  });
  feed.forEach((element) => {
    element.createdAt = moment(element.createdAt).format("DD MMM YYYY HH:mm:ss");
    element.updatedAt = moment(element.updatedAt).format("DD MMM YYYY HH:mm:ss");
  });
  return { props: { feed } };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <main className="container">
        <div className="row g-5">
          <div className="col-md-8">
            {props.feed.map((post) => (
              <div key={post.id} className="post col-12">
                <Post post={post} />
              </div>
            ))}
            <nav className="blog-pagination" aria-label="Pagination">
              <a className="btn btn-outline-primary" href="#">
                Older
              </a>
              <a className="btn btn-outline-secondary disabled">Newer</a>
            </nav>
          </div>
          <Sidebar />
        </div>
      </main>
    </Layout>
  );
};

export default Blog;
