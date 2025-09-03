import { pool } from "../db";
import { redis } from "../redis";

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
}

const CACHE_TTL = 60; // seconds

// Get all posts (id + title) with caching
export async function getAllPosts(): Promise<{ id: number; title: string }[]> {
  const cacheKey = "cache:posts:all";

  // Try Redis first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("Serving posts list from cache");
    return JSON.parse(cached);
  }

  // Otherwise fetch from DB
  const [rows] = await pool.query("SELECT id, title FROM posts");
  const posts = rows as { id: number; title: string }[];

  // Store in Redis
  await redis.set(cacheKey, JSON.stringify(posts), "EX", CACHE_TTL);
  console.log("Cached posts list in Redis");

  return posts;
}

// Get individual post with caching
export async function getPostById(id: number): Promise<Post | null> {
  const cacheKey = `cache:posts:${id}`;

  // Try Redis first
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`Serving post ${id} from cache`);
    return JSON.parse(cached);
  }

  // Otherwise fetch from DB
  const [rows] = await pool.query("SELECT * FROM posts WHERE id = ?", [id]);
  const posts = rows as Post[];

  if (posts.length === 0) return null;

  // Store in Redis
  await redis.set(cacheKey, JSON.stringify(posts[0]), "EX", CACHE_TTL);
  console.log(`Cached post ${id} in Redis`);

  return posts[0];
}

