<?php

namespace App\Http\Controllers;

use App\Models\Widget;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WidgetScriptController extends Controller
{
    /**
     * Serve the loader for a widget key. The loader sets the owner's saved settings,
     * then loads the toolbar. A switched-off widget or suspended account does nothing.
     */
    public function __invoke(Request $request, string $key): Response
    {
        $widget = Widget::query()->with('user')->where('key', $key)->first();

        if ($widget === null) {
            return $this->script('/* AccessEase: unknown widget key. */', 404);
        }

        if (! $widget->isServing()) {
            return $this->script('/* AccessEase: this widget is switched off. */');
        }

        $settings = json_encode(
            $widget->settings,
            JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_THROW_ON_ERROR
        );
        $toolbarUrl = json_encode(asset('accessease/accessease.js'), JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

        return $this->script(<<<JS
            window.ACCESSEASE_CONFIG = {$settings};
            (function () {
                if (window.AccessEase) { return; }
                var toolbar = document.createElement('script');
                toolbar.src = {$toolbarUrl};
                document.head.appendChild(toolbar);
            })();
            JS);
    }

    /**
     * Build the JavaScript response. A short cache keeps changes reaching visitors quickly.
     */
    private function script(string $body, int $status = 200): Response
    {
        return response($body."\n", $status, [
            'Content-Type' => 'application/javascript; charset=UTF-8',
            'Cache-Control' => 'public, max-age=300',
        ]);
    }
}
