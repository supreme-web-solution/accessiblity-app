<?php

namespace App\Http\Controllers;

use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $email = strtolower($request->user()->email);

        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        $widgets = $request->user()->widgets()->latest()->get();

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'widgetStats' => [
                'total' => $widgets->count(),
                'live' => $widgets->where('is_active', true)->count(),
                'off' => $widgets->where('is_active', false)->count(),
                'accountSuspended' => (bool) $request->user()->is_suspended,
            ],
            'recentWidgets' => $widgets->take(4)->map(fn ($widget): array => [
                'id' => $widget->id,
                'name' => $widget->name,
                'isActive' => $widget->is_active,
                'updatedAt' => $widget->updated_at?->diffForHumans(),
                'primaryColor' => $widget->settings['primaryColor'] ?? null,
            ])->values(),
        ]);
    }
}
