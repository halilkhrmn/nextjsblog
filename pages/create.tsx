import React, { useState } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import dynamic from "next/dynamic";
import slugify from "slugify";
import AsyncSelect from "react-select/async";

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});
const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [imageValue, setImageValue] = useState(null);
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryList, setCategoryList] = useState("");

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, description, imageValue, slug, category };
      await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/drafts");
    } catch (error) {
      console.error(error);
    }
  };
  const convertSlug = (e) => {
    setSlug(
      slugify(title, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: true, // strip special characters except replacement, defaults to `false`
        locale: "tr", // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      })
    );
  };
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event) => {
    event.preventDefault();
    const body = new FormData();
    body.append("file", image);
    const response = await fetch("/api/file", {
      method: "POST",
      body,
    });
    let json = await response.json();
    setImageValue(json.file);
  };
  const getCategory = async () => {
    const response = await fetch("/api/category", {
      method: "GET",
    });
    let json = await response.json();
    let cList = json;

    let cListx = cList.map((data) => ({ label: data.title, value: data.id }));
    return cListx;
  };

  return (
    <Layout>
      <div className="container">
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <div className="mb-3">
            <label htmlFor="titleInput" className="form-label">
              Title
            </label>
            <input className="form-control" id="titleInput" autoFocus onChange={(e) => setTitle(e.target.value)} placeholder="Title" type="text" value={title} />
          </div>
          <div className="mb-3">
            <label htmlFor="DescriptionInput" className="form-label">
              Description
            </label>
            <input className="form-control" id="DescriptionInput" onChange={(e) => setDescription(e.target.value)} placeholder="Description" type="text" value={description} />
          </div>
          <div className="mb-3">
            <label htmlFor="SlugInput" className="form-label">
              Slug
            </label>
            <input className="form-control" id="SlugInput" onChange={(e) => setSlug(e.target.value)} onClick={(e) => convertSlug(e)} placeholder="Slug" type="text" value={slug} />
          </div>
          <div className="mb-3">
            <label htmlFor="CategoryInput" className="form-label">
              Category
            </label>
            <AsyncSelect id="CategoryInput" cacheOptions loadOptions={getCategory} defaultOptions onChange={(e) => setCategory(e.value)} name="categoryId" className="basic-multi-select" />
          </div>

          <div className="mb-3">
            <label htmlFor="" className="form-label">
              Image
            </label>
            <input className="form-control" onChange={(e) => setImage(e.target.value)} placeholder="image" type="text" value={image} hidden />
            <img className="img-fluid" src={createObjectURL} />
            <input className="disabled form-control" placeholder="imageValue" type="text" value={imageValue} />
            <h4 className="mt-3">Select Image</h4>
            <input type="file" name="myImage" onChange={uploadToClient} />
            <button className="btn btn-primary" onClick={uploadToServer}>
              Send to server
            </button>
          </div>
          <SunEditor height="500px" defaultValue={content} onChange={(e) => setContent(e)} placeholder="Content" />
          <input className="btn btn-success" disabled={!content || !title} type="submit" value="Create" />
          <a className="btn btn-danger" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default Draft;
