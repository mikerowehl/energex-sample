// src/components/CreatePost.tsx
import { useState } from "react";
import { createPost } from "../api/laravel";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    try {
      const res = await createPost(title, content);
      setMessage(`Post created with ID ${res.data.id}`);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Error creating post");
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleCreate}>Create</button>
      <p>{message}</p>
    </div>
  );
}

