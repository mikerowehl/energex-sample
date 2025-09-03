import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import CreatePost from "./components/CreatePost";
import PostsList from "./components/PostsList";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/register">Register</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/create-post">Create Post</Link> | <Link to="/posts">Posts</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts" element={<PostsList />} />
      </Routes>
    </BrowserRouter>
  );
}

