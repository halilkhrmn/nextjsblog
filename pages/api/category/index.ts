import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  if (req.method === "GET") {
    const category = await prisma.category.findMany();
    res.json(category);
  } else if (req.method === "PUT") {
    const { title, slug } = req.body;
    const session = await getSession({ req });
    const result = await prisma.category.create({
      data: {
        title: title,
        slug: slug,
      },
    });
    res.json(result);
  }else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}
