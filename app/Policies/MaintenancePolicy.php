<?php

namespace App\Policies;

use App\Models\Maintenance;
use App\Models\User;

class MaintenancePolicy
{
    public function view(User $user, Maintenance $maintenance): bool
    {
        return $maintenance->car->user_id === $user->id;
    }

    public function update(User $user, Maintenance $maintenance): bool
    {
        return $maintenance->car->user_id === $user->id;
    }

    public function delete(User $user, Maintenance $maintenance): bool
    {
        return $maintenance->car->user_id === $user->id;
    }
}
