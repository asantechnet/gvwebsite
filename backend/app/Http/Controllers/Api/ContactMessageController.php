<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Models\Message;
use App\Notifications\ContactMessageReceived;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Notification;

class ContactMessageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreContactMessageRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $message = Message::create([
            'name' => $validated['name'],
            'email' => mb_strtolower($validated['email']),
            'subject' => $validated['subject'],
            'timeline' => $validated['timeline'] ?? null,
            'body' => $validated['message'],
        ]);

        if (config('globalvision.contact_notification_email')) {
            Notification::route('mail', config('globalvision.contact_notification_email'))
                ->notifyNow(new ContactMessageReceived($message));
        }

        return response()->json(['data' => [
            'id' => (string) $message->id,
            'received' => true,
        ]], 201);
    }
}
