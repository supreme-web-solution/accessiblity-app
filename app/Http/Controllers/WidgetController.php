<?php

namespace App\Http\Controllers;

use App\Http\Requests\WidgetRequest;
use App\Models\Widget;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class WidgetController extends Controller
{
    /**
     * List the signed-in user's widgets.
     */
    public function index(Request $request): Response
    {
        $widgets = $request->user()
            ->widgets()
            ->latest()
            ->get()
            ->map(fn (Widget $widget): array => $this->widgetData($widget));

        return Inertia::render('widgets/index', [
            'widgets' => $widgets,
        ]);
    }

    /**
     * Show the form for a new widget.
     */
    public function create(): Response
    {
        return Inertia::render('widgets/create', [
            'defaults' => $this->defaultSettings(),
            'languages' => WidgetRequest::LANGUAGES,
            'positions' => WidgetRequest::POSITIONS,
            'features' => WidgetRequest::FEATURES,
        ]);
    }

    /**
     * Save a new widget for the signed-in user.
     */
    public function store(WidgetRequest $request): RedirectResponse
    {
        $widget = $request->user()->widgets()->create([
            'name' => $request->validated('name'),
            'settings' => $request->widgetSettings(),
            'is_active' => $request->boolean('isActive'),
        ]);

        return to_route('widgets.edit', $widget)
            ->with('status', 'Widget created. Copy the script line from the Install section.');
    }

    /**
     * Show the editor for one of the user's widgets.
     */
    public function edit(Request $request, Widget $widget): Response
    {
        Gate::authorize('manage', $widget);

        return Inertia::render('widgets/edit', [
            'widget' => $this->widgetData($widget),
            'languages' => WidgetRequest::LANGUAGES,
            'positions' => WidgetRequest::POSITIONS,
            'features' => WidgetRequest::FEATURES,
            'isSuspended' => (bool) $request->user()->is_suspended,
        ]);
    }

    /**
     * Save changes to one of the user's widgets.
     */
    public function update(WidgetRequest $request, Widget $widget): RedirectResponse
    {
        Gate::authorize('manage', $widget);

        $widget->update([
            'name' => $request->validated('name'),
            'settings' => $request->widgetSettings(),
            'is_active' => $request->boolean('isActive'),
        ]);

        return back()->with('status', 'Changes saved.');
    }

    /**
     * Delete one of the user's widgets. Its script line stops working.
     */
    public function destroy(Widget $widget): RedirectResponse
    {
        Gate::authorize('manage', $widget);

        $widget->delete();

        return to_route('widgets.index')->with('status', 'Widget deleted.');
    }

    /**
     * Issue a new key. The old script line stops working straight away.
     */
    public function regenerateKey(Widget $widget): RedirectResponse
    {
        Gate::authorize('manage', $widget);

        $widget->update(['key' => Widget::generateKey()]);

        return back()->with('status', 'New script line created. Replace the old one on your site.');
    }

    /**
     * Show a test page with the saved widget, as visitors will see it.
     */
    public function preview(Widget $widget): View
    {
        Gate::authorize('manage', $widget);

        return view('widgets.preview', [
            'scriptUrl' => route('widget.script', $widget->key),
        ]);
    }

    /**
     * The fields the editor needs for one widget.
     *
     * @return array{id: int, name: string, key: string, isActive: bool, settings: array<string, mixed>, snippet: string, updatedAt: string|null}
     */
    private function widgetData(Widget $widget): array
    {
        return [
            'id' => $widget->id,
            'name' => $widget->name,
            'key' => $widget->key,
            'isActive' => $widget->is_active,
            'settings' => $widget->settings,
            'snippet' => '<script src="'.route('widget.script', $widget->key).'" defer></script>',
            'updatedAt' => $widget->updated_at?->diffForHumans(),
        ];
    }

    /**
     * Starting values for a new widget, matching the widget's own defaults.
     *
     * @return array<string, mixed>
     */
    private function defaultSettings(): array
    {
        return [
            'brandName' => 'AccessEase',
            'primaryColor' => '#1663d7',
            'textColor' => '#ffffff',
            'highlightColor' => '#ffe600',
            'position' => 'bottom-right',
            'offset' => 20,
            'uiLanguage' => '',
            'language' => 'en',
            'statementUrl' => '',
            'features' => collect(WidgetRequest::FEATURES)
                ->mapWithKeys(fn (string $feature): array => [$feature => true])
                ->all(),
        ];
    }
}
