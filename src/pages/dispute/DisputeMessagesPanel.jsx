import React from "react";

const DisputeMessagesPanel = ({
    showMessages,
    messages,
    messagesLoading,
    messagesError,
    formatDateTime,
    newMessage,
    setNewMessage,
    onSendMessage,
    postingMessage,
    postMessageError,
    getMessageSenderName,
}) => {
    return (
        <div className="space-y-4">
            {showMessages && (
                <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 h-64 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Dispute Messages
                        </p>
                        {messagesLoading && (
                            <span className="text-[11px] text-gray-500">
                                Loading…
                            </span>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {messagesError ? (
                            <p className="text-xs text-red-500">
                                {messagesError}
                            </p>
                        ) : messages.length === 0 ? (
                            <p className="text-xs text-gray-500">
                                No messages for this dispute yet.
                            </p>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="bg-white rounded-md border border-gray-200 px-3 py-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-700">
                                            {getMessageSenderName
                                                ? getMessageSenderName(msg.sender_id)
                                                : `Sender #${msg.sender_id}`}
                                        </span>
                                        <span className="text-[11px] text-gray-400">
                                            {formatDateTime(msg.created_at)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-800 whitespace-pre-line">
                                        {msg.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Admin reply box */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSendMessage && onSendMessage();
                        }}
                        className="mt-2 pt-2 border-t border-gray-200 flex gap-2 items-start"
                    >
                        <textarea
                            rows={2}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 text-xs text-black rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 resize-none"
                            placeholder="Write a reply to this dispute..."
                        />
                        <div className="flex flex-col items-end gap-1">
                            {postMessageError && (
                                <p className="text-[11px] text-red-500">
                                    {postMessageError}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={postingMessage || !newMessage.trim()}
                                className="px-3 py-1 rounded-md text-xs font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {postingMessage ? "Sending…" : "Send"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DisputeMessagesPanel;
