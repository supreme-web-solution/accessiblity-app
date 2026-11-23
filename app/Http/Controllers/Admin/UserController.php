<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Widget;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * List every user with their widget count.
     */
    public function index(): Response
    {
        $users = User::query()
            ->withCount('widgets')
            ->latest()
            ->paginate(25)
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'isAdmin' => $user->is_admin,
                'isSuspended' => $user->is_suspended,
                'widgetsCount' => $user->widgets_count,
                'joined' => $user->created_at?->toDateString(),
            ]);

        return Inertia::render('admin/users', [
            'users' => $users,
            'stats' => [
                'total' => User::query()->count(),
                'suspended' => User::query()->where('is_suspended', true)->count(),
                'widgets' => Widget::query()->count(),
            ],
        ]);
    }

    /**
     * Create an account and email the new person a link to choose their password.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(64)),
            'email_verified_at' => now(),
        ]);

        Password::sendResetLink(['email' => $user->email]);

        return back()->with('status', "Account created. An invitation was sent to {$user->email}.");
    }

    /**
     * Change a user's name or email address.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        $user->update($validated);

        return back()->with('status', 'User updated.');
    }

    /**
     * Delete an account and its widgets. Admins cannot delete themselves or other admins.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($user->is($request->user()), 422, 'You cannot delete your own account.');
        abort_if($user->is_admin, 422, 'Administrator accounts are set in ADMIN_EMAIL and cannot be deleted here.');

        $email = $user->email;
        $user->delete();

        return back()->with('status', "Account {$email} deleted.");
    }

    /**
     * Suspend or restore a user. A suspended user's widgets stop working.
     */
    public function updateSuspension(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'suspended' => ['required', 'boolean'],
        ]);

        abort_if($user->is($request->user()), 422, 'You cannot suspend your own account.');

        $user->is_suspended = $validated['suspended'];
        $user->save();

        return back()->with('status', $validated['suspended'] ? 'Account suspended.' : 'Account restored.');
    }
}
