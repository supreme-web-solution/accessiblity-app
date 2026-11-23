<?php

use App\Http\Requests\WidgetRequest;
use App\Models\User;
use App\Models\Widget;

/**
 * A valid widget form submission.
 *
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function widgetPayload(array $overrides = []): array
{
    return array_replace_recursive([
        'name' => 'Main site',
        'isActive' => true,
        'settings' => [
            'brandName' => 'AccessEase',
            'primaryColor' => '#1663d7',
            'textColor' => '#ffffff',
            'highlightColor' => '#ffe600',
            'position' => 'bottom-right',
            'offset' => 20,
            'uiLanguage' => '',
            'language' => 'en',
            'statementUrl' => '',
            'features' => collect(WidgetRequest::FEATURES)->mapWithKeys(fn (string $feature): array => [$feature => true])->all(),
        ],
    ], $overrides);
}

test('guests are sent to log in', function () {
    $this->get(route('widgets.index'))->assertRedirect(route('login'));
});

test('users only see their own widgets', function () {
    $user = User::factory()->create();
    $mine = Widget::factory()->create(['user_id' => $user->id, 'name' => 'Mine']);
    Widget::factory()->create(['name' => 'Someone else']);

    $this->actingAs($user)
        ->get(route('widgets.index'))
        ->assertOk()
        ->assertSee($mine->key)
        ->assertDontSee('Someone else');
});

test('a new widget gets a key and keeps only known tools', function () {
    $user = User::factory()->create();
    $payload = widgetPayload(['settings' => ['features' => ['dictionary' => false, 'hackerTool' => true]]]);

    $this->actingAs($user)->post(route('widgets.store'), $payload)->assertRedirect();

    $widget = $user->widgets()->sole();
    expect($widget->key)->toHaveLength(32)
        ->and($widget->settings['features'])->toHaveKey('dictionary', false)
        ->and($widget->settings['features'])->not->toHaveKey('hackerTool')
        ->and($widget->settings)->not->toHaveKey('statementUrl');
});

test('invalid colours and positions are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('widgets.store'), widgetPayload(['settings' => ['primaryColor' => 'red', 'position' => 'centre']]))
        ->assertSessionHasErrors(['settings.primaryColor', 'settings.position']);

    expect($user->widgets()->count())->toBe(0);
});

test('an owner can change their widget', function () {
    $user = User::factory()->create();
    $widget = Widget::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patch(route('widgets.update', $widget), widgetPayload(['name' => 'Renamed', 'isActive' => false, 'settings' => ['brandName' => 'Council']]))
        ->assertRedirect();

    $widget->refresh();
    expect($widget->name)->toBe('Renamed')
        ->and($widget->is_active)->toBeFalse()
        ->and($widget->settings['brandName'])->toBe('Council');
});

test('users cannot open, change or delete someone else\'s widget', function () {
    $owner = User::factory()->create();
    $widget = Widget::factory()->create(['user_id' => $owner->id]);
    $intruder = User::factory()->create();

    $this->actingAs($intruder)->get(route('widgets.edit', $widget))->assertForbidden();
    $this->actingAs($intruder)->patch(route('widgets.update', $widget), widgetPayload())->assertForbidden();
    $this->actingAs($intruder)->delete(route('widgets.destroy', $widget))->assertForbidden();

    expect($widget->fresh())->not->toBeNull();
});

test('regenerating the key makes the old script line stop working', function () {
    $user = User::factory()->create();
    $widget = Widget::factory()->create(['user_id' => $user->id]);
    $oldKey = $widget->key;

    $this->actingAs($user)->post(route('widgets.regenerate-key', $widget))->assertRedirect();

    expect($widget->fresh()->key)->not->toBe($oldKey);
    $this->get("/widget/{$oldKey}.js")->assertNotFound();
});

test('deleting a widget removes it', function () {
    $user = User::factory()->create();
    $widget = Widget::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->delete(route('widgets.destroy', $widget))->assertRedirect(route('widgets.index'));

    expect(Widget::query()->whereKey($widget->id)->exists())->toBeFalse();
});

test('a widget that does not exist sends the user back to their list with a message', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/widgets/999')
        ->assertRedirect(route('widgets.index'))
        ->assertSessionHas('status');
});
