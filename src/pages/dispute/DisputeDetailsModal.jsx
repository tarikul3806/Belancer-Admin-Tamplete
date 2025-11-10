// src/pages/dispute/DisputeDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { fetchData, postData } from "../../common/axiosInstance";
import DisputeDetailsHeader from "./DisputeDetailsHeader";
import DisputeSummary from "./DisputeSummary";
import DisputeMessagesPanel from "./DisputeMessagesPanel";
import DisputeAdminResolutionForm from "./DisputeAdminResolutionForm";
import DisputeDetailsFooter from "./DisputeDetailsFooter";

const DisputeDetailsModal = ({
    isOpen,
    dispute,
    onClose,
    status,
    setStatus,
    resolution,
    setResolution,
    refundAmount,
    setRefundAmount,
    saving,
    saveError,
    saveSuccess,
    onSubmit,
    getStatusBadgeClasses,
    formatDateTime,
}) => {
    const [raisedByUser, setRaisedByUser] = useState(null);
    const [againstUser, setAgainstUser] = useState(null);

    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState("");
    const [showMessages, setShowMessages] = useState(true);
    // Admin reply
    const [newMessage, setNewMessage] = useState("");
    const [postingMessage, setPostingMessage] = useState(false);
    const [postMessageError, setPostMessageError] = useState("");

    const getDisplayName = (user) => {
        if (!user) return "";

        const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
        if (full) return full;

        if (user.display_name) return user.display_name;

        return `User #${user.user_id || user.id}`;
    };

    const getMessageSenderName = (senderId) => {
        if (!senderId) return "-";

        // Match with "raised by" user
        if (
            raisedByUser &&
            (
                senderId === dispute.raised_by ||
                senderId === raisedByUser.user_id ||
                senderId === raisedByUser.id
            )
        ) {
            return getDisplayName(raisedByUser);
        }

        // Match with "against" user
        if (
            againstUser &&
            (
                senderId === dispute.against_id ||
                senderId === againstUser.user_id ||
                senderId === againstUser.id
            )
        ) {
            return getDisplayName(againstUser);
        }

        // Fallback – likely admin or unknown
        return `Sender #${senderId}`;
    };

    useEffect(() => {
        // when modal is closed or dispute is missing, clear everything
        if (!isOpen || !dispute) {
            setRaisedByUser(null);
            setAgainstUser(null);
            setMessages([]);
            setMessagesError("");
            setMessagesLoading(false);
            setNewMessage("");
            setPostingMessage(false);
            setPostMessageError("");
            return;
        }

        const loadExtraData = async () => {
            try {
                setMessagesLoading(true);
                setMessagesError("");

                const [raised, against, messagesRes] = await Promise.all([
                    dispute.raised_by
                        ? fetchData("/auth/seller-profile", {
                            user_id: dispute.raised_by,
                        })
                        : Promise.resolve(null),
                    dispute.against_id
                        ? fetchData("/auth/seller-profile", {
                            user_id: dispute.against_id,
                        })
                        : Promise.resolve(null),
                    fetchData(`/disputes/${dispute.id}/messages`),
                ]);
                console.log("Fetched dispute extra data:", {
                    raised,
                    against,
                    messagesRes,
                });

                setRaisedByUser(raised);
                setAgainstUser(against);

                const msgs = Array.isArray(messagesRes?.messages)
                    ? messagesRes.messages
                    : [];
                setMessages(msgs);
            } catch (err) {
                console.error("Failed to fetch extra dispute data", err);
                setMessages([]);
                setMessagesError("Failed to load messages.");
            } finally {
                setMessagesLoading(false);
            }
        };

        loadExtraData();
    }, [isOpen, dispute]);

    const handleSendAdminMessage = async () => {
        if (!dispute) return;

        const trimmed = newMessage.trim();
        if (!trimmed) return;

        try {
            setPostingMessage(true);
            setPostMessageError("");

            const created = await postData(`/disputes/${dispute.id}`, {
                message: trimmed,
            });

            setMessages((prev) => [...prev, created]);
            setNewMessage("");
        } catch (err) {
            console.error("Failed to send dispute message", err);
            setPostMessageError("Failed to send message. Please try again.");
        } finally {
            setPostingMessage(false);
        }
    };

    if (!isOpen || !dispute) return null;

    const isResolved = dispute.status === "resolved";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-5xl max-h-[calc(100vh-4rem)] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                <DisputeDetailsHeader
                    dispute={dispute}
                    showMessages={showMessages}
                    onToggleMessages={() =>
                        setShowMessages((prev) => !prev)
                    }
                    onClose={onClose}
                />

                <div className="px-6 py-4 text-sm flex-1 overflow-y-auto">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                        {/* LEFT: Dispute details */}
                        <DisputeSummary
                            dispute={dispute}
                            raisedByUser={raisedByUser}
                            againstUser={againstUser}
                            getDisplayName={getDisplayName}
                            getStatusBadgeClasses={getStatusBadgeClasses}
                            formatDateTime={formatDateTime}
                        />

                        {/* RIGHT: Messages */}
                        <DisputeMessagesPanel
                            showMessages={showMessages}
                            messages={messages}
                            messagesLoading={messagesLoading}
                            messagesError={messagesError}
                            formatDateTime={formatDateTime}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            onSendMessage={handleSendAdminMessage}
                            postingMessage={postingMessage}
                            postMessageError={postMessageError}
                            getMessageSenderName={getMessageSenderName}
                        />
                    </div>

                    {/* Admin Resolution Form / resolved note */}
                    <DisputeAdminResolutionForm
                        isResolved={isResolved}
                        onSubmit={onSubmit}
                        status={status}
                        setStatus={setStatus}
                        refundAmount={refundAmount}
                        setRefundAmount={setRefundAmount}
                        resolution={resolution}
                        setResolution={setResolution}
                    />
                </div>

                <DisputeDetailsFooter
                    isResolved={isResolved}
                    saving={saving}
                    saveError={saveError}
                    saveSuccess={saveSuccess}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};

export default DisputeDetailsModal;
