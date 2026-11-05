<?php

namespace App\Http\Controllers\Api\Cms;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class AuditLogController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        Gate::authorize('view-audit-log');

        return AuditLogResource::collection(
            AuditLog::query()
                ->with('actor:id,name')
                ->latest()
                ->latest('id')
                ->paginate(50),
        );
    }
}
