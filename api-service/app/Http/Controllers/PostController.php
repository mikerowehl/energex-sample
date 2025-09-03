<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    // Create a post — requires JWT auth (see routes)
    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // get authenticated user id (uses the 'api' guard which you configured to jwt)
        $userId = auth('api')->id();

        // If you used timestamps() in migration (recommended):
        $post = Post::create([
            'title'   => $request->title,
            'content' => $request->content,
            'user_id' => $userId,
        ]);

        // If you used option B (no timestamps) and set $timestamps = false on model,
        // you'd create with 'created_at' => now() explicitly.

        return response()->json(['id' => $post->id], 201);
    }

    // List posts (id + title)
    public function index()
    {
        $posts = Post::select('id', 'title')->get();
        return response()->json($posts);
    }

    // Show single post (all fields). Uses implicit route-model binding.
    public function show(Post $post)
    {
        // limit fields to exactly what you asked for:
        return response()->json($post->only(['id', 'title', 'content', 'user_id', 'created_at']));
    }
}
