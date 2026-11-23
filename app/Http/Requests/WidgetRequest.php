<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WidgetRequest extends FormRequest
{
    /**
     * Tools a site owner can switch off. Keys match the widget's feature names.
     *
     * @var list<string>
     */
    public const FEATURES = [
        'textSize', 'lineHeight', 'spacing', 'align', 'dyslexia', 'contrast', 'darkMode',
        'saturation', 'colorFilter', 'hideImages', 'hideDistractions', 'pauseAnimations',
        'focusIndicator', 'bigCursor', 'magnifier', 'highlightLinks', 'highlightHeadings',
        'highlightHover', 'readingGuide', 'readingMask', 'pageStructure', 'keyboard',
        'textToSpeech', 'dictionary', 'muteSounds', 'voiceControl', 'profiles', 'statement',
        'customColors',
    ];

    /**
     * Languages the widget menu is translated into.
     *
     * @var list<string>
     */
    public const LANGUAGES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'pl', 'sv', 'da', 'fi', 'el', 'bn'];

    /**
     * Corner and edge positions for the floating button.
     *
     * @var list<string>
     */
    public const POSITIONS = ['bottom-right', 'bottom-left', 'middle-right', 'middle-left', 'top-right', 'top-left'];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $hex = ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'];

        return [
            'name' => ['required', 'string', 'max:100'],
            'isActive' => ['required', 'boolean'],
            'settings' => ['required', 'array'],
            'settings.brandName' => ['required', 'string', 'max:60'],
            'settings.primaryColor' => $hex,
            'settings.textColor' => $hex,
            'settings.highlightColor' => $hex,
            'settings.position' => ['required', Rule::in(self::POSITIONS)],
            'settings.offset' => ['required', 'integer', 'between:0,200'],
            'settings.uiLanguage' => ['nullable', Rule::in(self::LANGUAGES)],
            'settings.language' => ['required', 'string', 'max:5'],
            'settings.statementUrl' => ['nullable', 'url', 'max:255'],
            'settings.features' => ['present', 'array'],
            'settings.features.*' => ['boolean'],
        ];
    }

    /**
     * The settings to store: only known feature keys, in the widget's own format.
     *
     * @return array<string, mixed>
     */
    public function widgetSettings(): array
    {
        $settings = $this->validated('settings');

        $settings['features'] = collect(self::FEATURES)
            ->mapWithKeys(fn (string $feature): array => [
                $feature => (bool) data_get($settings, "features.{$feature}", false),
            ])
            ->all();

        if (blank($settings['statementUrl'] ?? null)) {
            unset($settings['statementUrl']);
        }

        $settings['uiLanguage'] = $settings['uiLanguage'] ?? '';

        return $settings;
    }
}
