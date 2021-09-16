import React from "react";
import Router from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getData();
    async function getData() {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data);
    }
  }, [setCategories]);

  return (
    <div className="col-md-4">
      <div className="position-sticky" style={{ top: "2rem" }}>
        <div className="p-4">
          <h4 className="fst-italic">Kategoriler</h4>
          <div className="list-group">
            {categories.length > 0
              ? categories.map((cat) => (
                  <Link href={"/cat/" + cat.slug}>
                    <a className="list-group-item list-group-item-action">{cat.title}</a>
                  </Link>
                ))
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
