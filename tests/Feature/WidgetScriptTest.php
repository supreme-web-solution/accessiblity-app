<?php

use App\Models\User;
use App\Models\Widget;

test('an active widget serves a loader with the saved settings', function () {
    $widget = Widget::factory()->create([
        'settings' => ['brandName' => 'Council Access', 'primaryColor' => '#0b5394', 'position' => 'top-left', 'features' => ['dictionary' => false]],
    ]);

    $response = $this->get(route('widget.script', $widget->key));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/javascript; charset=UTF-8');
    $response->assertSee('window.ACCESSEASE_CONFIG =', escape: false);
    $response->assertSee('"brandName":"Council Access"', escape: false);
    $response->assertSee('"dictionary":false', escape: false);
    $response->assertSee('/accessease/accessease.js', escape: false);
});

test('an unknown key returns not found', function () {
    $this->get('/widget/does-not-exist.js')->assertNotFound();
});

test('a switched-off widget does nothing on visitors\' pages', function () {
    $widget = Widget::factory()->inactive()->create();

    $response = $this->get(route('widget.script', $widget->key));

    $response->assertOk();
    $response->assertSee('switched off', escape: false);
    $response->assertDontSee('ACCESSEASE_CONFIG', escape: false);
});

test('a suspended account stops its widgets', function () {
    $owner = User::factory()->create(['is_suspended' => true]);
    $widget = Widget::factory()->create(['user_id' => $owner->id]);

    $response = $this->get(route('widget.script', $widget->key));

    $response->assertOk();
    $response->assertDontSee('ACCESSEASE_CONFIG', escape: false);
});

test('settings cannot close the script tag early', function () {
    $widget = Widget::factory()->create([
        'settings' => ['brandName' => '</script><script>alert(1)</script>'],
    ]);

    $response = $this->get(route('widget.script', $widget->key));

    $response->assertDontSee('</script>', escape: false);
});
