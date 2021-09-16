import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Head from "next/head";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

  const [session, loading] = useSession();

  let left = (
    <div className="left">
      <Link href="/">
        <a className="bold" data-active={isActive("/")}>
          Feeds
        </a>
      </Link>
    </div>
  );

  let right = null;

  if (session) {
    right = (
      <div className="text-end">
        <Link href="/create">
          <button className="btn btn-light text-dark me-2">
            <a>New post</a>
          </button>
        </Link>
        <button className="btn btn-danger text-dark me-2" onClick={() => signOut()}>
          <a>Log out</a>
        </button>
      </div>
    );
  }

  return (
    <header className="p-3 mb-5 bg-dark text-white">
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
        <link href="/style/style.css" rel="stylesheet" />
      </Head>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            sa
          </a>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li className="nav-item">
              <Link href="/">
                <a className="nav-link" data-active={isActive("/")}>
                  Ana Sayfa
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about">
                <a className="nav-link" data-active={isActive("/about")}>
                  Hakkımda
                </a>
              </Link>
            </li>
          </ul>

          {right}
        </div>
      </div>
    </header>
  );
};

export default Header;
