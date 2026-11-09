<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('content_records');
        Schema::dropIfExists('personal_access_tokens');
    }

    public function down(): void
    {
        // The CMS persists managed collections through site_snapshots and uses
        // Sanctum's stateful cookie authentication rather than API tokens.
    }
};
