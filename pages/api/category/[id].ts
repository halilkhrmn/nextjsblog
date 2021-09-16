import prisma from '../../../lib/prisma';

// DELETE /api/post/:id
export default async function handle(req, res) {
  const categoryId = req.query.id;
  if (req.method === 'DELETE') {
    const post = await prisma.category.delete({
      where: { id: Number(categoryId) },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}