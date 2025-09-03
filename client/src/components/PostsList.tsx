// src/components/PostsList.tsx
import { useEffect, useState } from "react";
import { getPosts } from "../api/node";
import PostDetail from "./PostDetail";

interface Post {
  id: number;
  title: string;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts();
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <button onClick={() => setSelectedId(p.id)}>{p.title}</button>
          </li>
        ))}
      </ul>
      {selectedId && <PostDetail id={selectedId} />}
    </div>
  );
}

