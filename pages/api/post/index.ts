
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req, res) {
  console.log(req.body);
  const { title, content,imageValue,slug,category,description } = req.body;
  const session = await getSession({ req });
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      image: imageValue,
      slug: slug,
      description:description,
      category: { connect: {id:category} },
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}