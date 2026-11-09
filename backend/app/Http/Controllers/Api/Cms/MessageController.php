<?php

namespace App\Http\Controllers\Api\Cms;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\ReplyToMessageRequest;
use App\Http\Requests\Cms\UpdateMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\AuditLog;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Mail;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Message::class);

        return MessageResource::collection(
            Message::query()->latest()->latest('id')->paginate(50),
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMessageRequest $request, Message $message): MessageResource
    {
        $message->update([
            'read_at' => $request->boolean('unread') ? null : now(),
        ]);
        AuditLog::create([
            'actor_id' => $request->user()->id,
            'action' => $request->boolean('unread') ? 'message.marked_unread' : 'message.marked_read',
            'auditable_type' => $message->getMorphClass(),
            'auditable_id' => $message->id,
            'ip_address' => $request->ip(),
        ]);

        return new MessageResource($message);
    }

    public function reply(ReplyToMessageRequest $request, Message $message): MessageResource
    {
        $validated = $request->validated();
        Mail::raw($validated['message'], fn ($mail) => $mail
            ->to($message->email)
            ->replyTo(config('mail.from.address'))
            ->subject($validated['subject']));
        $message->update([
            'reply_subject' => $validated['subject'],
            'reply_body' => $validated['message'],
            'replied_by' => $request->user()->id,
            'replied_at' => now(),
            'read_at' => $message->read_at ?? now(),
        ]);
        AuditLog::create(['actor_id' => $request->user()->id, 'action' => 'message.replied', 'auditable_type' => $message->getMorphClass(), 'auditable_id' => $message->id, 'ip_address' => $request->ip()]);

        return new MessageResource($message->refresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Message $message): JsonResponse
    {
        $this->authorize('delete', $message);
        AuditLog::create([
            'actor_id' => $request->user()->id,
            'action' => 'message.deleted',
            'auditable_type' => $message->getMorphClass(),
            'auditable_id' => $message->id,
            'metadata' => ['subject' => $message->subject],
            'ip_address' => $request->ip(),
        ]);
        $message->delete();

        return response()->json(null, 204);
    }
}
