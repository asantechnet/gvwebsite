<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('content_records', function (Blueprint $table) {
            $table->id();
            $table->string('collection', 60);
            $table->string('slug', 180);
            $table->string('type', 60)->nullable();
            $table->string('category', 120)->nullable();
            $table->string('status', 20)->default('draft');
            $table->boolean('featured')->default(false);
            $table->string('image', 2048)->nullable();
            $table->string('href', 2048)->nullable();
            $table->json('translations');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['collection', 'slug']);
            $table->index(['collection', 'status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_records');
    }
};
