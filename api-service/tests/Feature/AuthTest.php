<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'JohnDoe',
            'email' => 'john@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(201)
                 ->assertJson(['message' => 'User created successfully']);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_registration_requires_unique_email_and_name()
    {
        User::factory()->create([
            'name' => 'JohnDoe',
            'email' => 'john@example.com',
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'JohnDoe',
            'email' => 'john@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email']);
    }

    public function test_a_user_can_login_and_get_jwt_token()
    {
        $user = User::factory()->create([
            'name' => 'JaneDoe',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'name' => 'JaneDoe',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token']);
    }

    public function test_login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'name' => 'JaneDoe',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'name' => 'JaneDoe',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['error' => 'Invalid credentials']);
    }
}
