<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Widget;

class WidgetPolicy
{
    /**
     * Determine whether the user owns the widget and can view or change it.
     */
    public function manage(User $user, Widget $widget): bool
    {
        return $user->id === $widget->user_id;
    }
}
