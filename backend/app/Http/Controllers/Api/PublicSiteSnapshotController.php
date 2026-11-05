<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSnapshotResource;
use App\Models\SiteSnapshot;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicSiteSnapshotController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SiteSnapshotResource::collection(
            SiteSnapshot::query()
                ->whereNotNull('published_at')
                ->orderBy('key')
                ->get(),
        );
    }
}
