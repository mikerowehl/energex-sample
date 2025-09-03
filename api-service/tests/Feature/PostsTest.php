<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PostsTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticateUser()
    {
        $user = User::factory()->create([
            'password' => bcrypt('secret123'),
        ]);

        $loginResponse = $this->postJson('/api/login', [
            'name' => $user->name,
            'password' => 'secret123',
        ]);

        $token = $loginResponse->json('token');

        return ['user' => $user, 'token' => $token];
    }

    public function test_guests_cannot_access_posts_endpoints()
    {
        $this->getJson('/api/posts')
             ->assertStatus(401);

        $this->postJson('/api/posts', [
            'title' => 'Test',
            'content' => 'Body',
        ])->assertStatus(401);
    }

    public function test_authenticated_user_can_create_post()
    {
        ['user' => $user, 'token' => $token] = $this->authenticateUser();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/posts', [
                'title' => 'My first post',
                'content' => 'Hello World!',
            ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['id']);

        $this->assertDatabaseHas('posts', [
            'title' => 'My first post',
            'content' => 'Hello World!',
            'user_id' => $user->id,
        ]);
    }

    public function test_authenticated_user_can_list_posts()
    {
        ['user' => $user, 'token' => $token] = $this->authenticateUser();

        Post::factory()->count(2)->create(['user_id' => $user->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/posts');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     ['id', 'title']
                 ]);
    }

    public function test_authenticated_user_can_view_single_post()
    {
        ['user' => $user, 'token' => $token] = $this->authenticateUser();

        $post = Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Detail post',
            'content' => 'This is the body',
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/posts/{$post->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $post->id,
                     'title' => 'Detail post',
                     'content' => 'This is the body',
                     'user_id' => $user->id,
                 ]);
    }
}
