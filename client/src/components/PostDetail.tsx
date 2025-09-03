// src/components/PostDetail.tsx
import { useEffect, useState } from "react";
import { getPost } from "../api/node";

interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  created_at: string;
}

export default function PostDetail({ id }: { id: number }) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(id);
      setPost(res.data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <small>Author ID: {post.user_id}</small>
      <br />
      <small>Created at: {post.created_at}</small>
    </div>
  );
}

