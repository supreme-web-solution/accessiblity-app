<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Widget;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Widget>
 */
class WidgetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->words(2, true),
            'settings' => [
                'brandName' => 'AccessEase',
                'primaryColor' => '#1663d7',
                'textColor' => '#ffffff',
                'highlightColor' => '#ffe600',
                'position' => 'bottom-right',
                'offset' => 20,
            ],
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the widget is switched off.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => ['is_active' => false]);
    }
}
