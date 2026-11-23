<?php

use App\Models\User;
use App\Models\Widget;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

beforeEach(fn () => config(['app.admin_emails' => ['boss@example.com', 'second@example.com']]));

test('only admins can open the users page', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

test('admins can see every account with its widget count', function () {
    $admin = User::factory()->create(['email' => 'boss@example.com']);
    $member = User::factory()->create(['name' => 'Member Person']);
    Widget::factory()->count(2)->create(['user_id' => $member->id]);

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertSee('Member Person');
});

test('an admin can suspend an account and its widgets stop working', function () {
    $admin = User::factory()->create(['email' => 'boss@example.com']);
    $member = User::factory()->create();
    $widget = Widget::factory()->create(['user_id' => $member->id]);

    $this->actingAs($admin)
        ->patch(route('admin.users.suspension', $member), ['suspended' => true])
        ->assertRedirect();

    expect($member->fresh()->is_suspended)->toBeTrue();
    $this->get(route('widget.script', $widget->key))->assertDontSee('ACCESSEASE_CONFIG', escape: false);
});

test('an admin cannot suspend their own account', function () {
    $admin = User::factory()->create(['email' => 'boss@example.com']);

    $this->actingAs($admin)
        ->patch(route('admin.users.suspension', $admin), ['suspended' => true])
        ->assertUnprocessable();

    expect($admin->fresh()->is_suspended)->toBeFalse();
});

test('regular users cannot suspend other accounts', function () {
    $member = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($member)
        ->patch(route('admin.users.suspension', $other), ['suspended' => true])
        ->assertForbidden();

    expect($other->fresh()->is_suspended)->toBeFalse();
});

test('accounts listed in ADMIN_EMAIL are admins, matched without case', function () {
    expect(User::factory()->create(['email' => 'BOSS@example.com'])->is_admin)->toBeTrue()
        ->and(User::factory()->create(['email' => 'someone@example.com'])->is_admin)->toBeFalse();
});

test('an admin can invite a new user, who gets a password-reset email', function () {
    Notification::fake();
    $admin = User::factory()->create(['email' => 'boss@example.com']);

    $this->actingAs($admin)
        ->post(route('admin.users.store'), ['name' => 'New Person', 'email' => 'new@example.com'])
        ->assertRedirect()
        ->assertSessionHas('status');

    $created = User::query()->where('email', 'new@example.com')->sole();
    expect($created->name)->toBe('New Person');
    Notification::assertSentTo($created, ResetPassword::class);
});

test('invitations need a unique email', function () {
    $admin = User::factory()->create(['email' => 'boss@example.com']);
    User::factory()->create(['email' => 'taken@example.com']);

    $this->actingAs($admin)
        ->post(route('admin.users.store'), ['name' => 'Copy', 'email' => 'taken@example.com'])
        ->assertSessionHasErrors('email');
});

test('regular users cannot create, edit or delete accounts', function () {
    $member = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($member)->post(route('admin.users.store'), ['name' => 'X', 'email' => 'x@example.com'])->assertForbidden();
    $this->actingAs($member)->patch(route('admin.users.update', $other), ['name' => 'X', 'email' => 'x@example.com'])->assertForbidden();
    $this->actingAs($member)->delete(route('admin.users.destroy', $other))->assertForbidden();

    expect($other->fresh())->not->toBeNull();
});

test('an admin can edit a user and keep their own email unchanged', function () {
    $admin = User::factory()->create(['email' => 'boss@example.com']);
    $member = User::factory()->create(['name' => 'Old Name', 'email' => 'old@example.com']);

    $this->actingAs($admin)
        ->patch(route('admin.users.update', $member), ['name' => 'New Name', 'email' => 'old@example.com'])
        ->assertRedirect();

    expect($member->fresh()->name)->toBe('New Name');
});

test('an admin can delete a user and their widgets', function () {
    $admin = User::factory()->create(['email' => 'boss@example.com']);
    $member = User::factory()->create();
    $widget = Widget::factory()->create(['user_id' => $member->id]);

    $this->actingAs($admin)->delete(route('admin.users.destroy', $member))->assertRedirect();

    expect(User::query()->whereKey($member->id)->exists())->toBeFalse()
        ->and(Widget::query()->whereKey($widget->id)->exists())->toBeFalse();
});

test('an admin cannot delete themselves or another admin', function () {
    $admin = User::factory()->create(['email' => 'boss@example.com']);
    $otherAdmin = User::factory()->create(['email' => 'second@example.com']);

    $this->actingAs($admin)->delete(route('admin.users.destroy', $admin))->assertUnprocessable();
    $this->actingAs($admin)->delete(route('admin.users.destroy', $otherAdmin))->assertUnprocessable();

    expect($admin->fresh())->not->toBeNull();
});
