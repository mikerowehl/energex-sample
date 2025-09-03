import { Router, Response } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { getAllPosts, getPostById } from "../models/post";

const router = Router();

router.get("/posts", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/posts/:id", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;

