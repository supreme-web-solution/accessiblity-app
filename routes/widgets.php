<?php

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\WidgetController;
use App\Http\Controllers\WidgetScriptController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;

Route::get('widget/{key}.js', WidgetScriptController::class)
    ->middleware('throttle:120,1')
    ->name('widget.script');

$widgetNotFound = fn () => to_route('widgets.index')
    ->with('status', 'That widget could not be found. It may have been deleted.');

Route::middleware(['auth', 'verified'])->group(function () use ($widgetNotFound) {
    Route::get('widgets', [WidgetController::class, 'index'])->name('widgets.index');
    Route::get('widgets/create', [WidgetController::class, 'create'])->name('widgets.create');
    Route::post('widgets', [WidgetController::class, 'store'])->name('widgets.store');
    Route::get('widgets/{widget}', [WidgetController::class, 'edit'])->name('widgets.edit')->missing($widgetNotFound);
    Route::patch('widgets/{widget}', [WidgetController::class, 'update'])->name('widgets.update')->missing($widgetNotFound);
    Route::delete('widgets/{widget}', [WidgetController::class, 'destroy'])->name('widgets.destroy')->missing($widgetNotFound);
    Route::post('widgets/{widget}/regenerate-key', [WidgetController::class, 'regenerateKey'])->name('widgets.regenerate-key')->missing($widgetNotFound);
    Route::get('widgets/{widget}/preview', [WidgetController::class, 'preview'])->name('widgets.preview')->missing($widgetNotFound);

    Route::middleware(EnsureUserIsAdmin::class)->prefix('admin')->name('admin.')->group(function () {
        Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
        Route::patch('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::patch('users/{user}/suspension', [AdminUserController::class, 'updateSuspension'])->name('users.suspension');
    });
});
