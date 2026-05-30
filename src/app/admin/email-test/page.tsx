"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  UserCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2,
  Inbox,
  MessageSquare,
} from "lucide-react";

type EmailType = "contact-admin" | "booking-admin" | "contact-customer" | "booking-customer";

interface EmailCard {
  type: EmailType;
  label: string;
  description: string;
  icon: typeof Mail;
  gradient: string;
  recipient: string;
}

const emailCards: EmailCard[] = [
  {
    type: "contact-admin",
    label: "Admin: Contact Notification",
    description: "Sent to admin when someone submits the contact form",
    icon: Inbox,
    gradient: "from-blue-500 to-cyan-500",
    recipient: "Admin inbox",
  },
  {
    type: "booking-admin",
    label: "Admin: Booking Notification",
    description: "Sent to admin when someone books a project (with file attachment demo)",
    icon: Building2,
    gradient: "from-purple-500 to-pink-500",
    recipient: "Admin inbox",
  },
  {
    type: "contact-customer",
    label: "Customer: Contact Confirmation",
    description: "Sent to customer after they submit the contact form",
    icon: MessageSquare,
    gradient: "from-teal-500 to-emerald-500",
    recipient: "Customer's email",
  },
  {
    type: "booking-customer",
    label: "Customer: Booking Confirmation",
    description: "Sent to customer after they book a project",
    icon: UserCheck,
    gradient: "from-amber-500 to-red-500",
    recipient: "Customer's email",
  },
];

export default function EmailTestPage() {
  const [sending, setSending] = useState<EmailType | null>(null);
  const [statuses, setStatuses] = useState<Record<string, { ok: boolean; message: string } | null>>({});
  const [sendAllLoading, setSendAllLoading] = useState(false);

  const sendEmail = async (type: EmailType) => {
    setSending(type);
    setStatuses((prev) => ({ ...prev, [type]: null }));

    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatuses((prev) => ({ ...prev, [type]: { ok: true, message: data.message } }));
      } else {
        setStatuses((prev) => ({ ...prev, [type]: { ok: false, message: data.error || "Request failed" } }));
      }
    } catch (err: any) {
      setStatuses((prev) => ({ ...prev, [type]: { ok: false, message: err.message || "Network error" } }));
    } finally {
      setSending(null);
    }
  };

  const sendAll = async () => {
    setSendAllLoading(true);
    setStatuses({});

    for (const card of emailCards) {
      setSending(card.type);
      try {
        const res = await fetch("/api/admin/test-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: card.type }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatuses((prev) => ({ ...prev, [card.type]: { ok: true, message: data.message } }));
        } else {
          setStatuses((prev) => ({ ...prev, [card.type]: { ok: false, message: data.error || "Request failed" } }));
        }
      } catch (err: any) {
        setStatuses((prev) => ({ ...prev, [card.type]: { ok: false, message: err.message || "Network error" } }));
      }
    }

    setSending(null);
    setSendAllLoading(false);
  };

  const allSent = emailCards.every((c) => statuses[c.type] !== null);
  const allOk = allSent && emailCards.every((c) => statuses[c.type]?.ok);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Test Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Send test emails to your inbox to verify each template looks correct
          </p>
        </div>
        <div className="flex items-center gap-3">
          {allSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                allOk
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {allOk ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> All sent successfully
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" /> Some failed
                </>
              )}
            </motion.div>
          )}
          <button
            onClick={sendAll}
            disabled={sendAllLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendAllLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send All 4
          </button>
        </div>
      </div>

      {/* Email Cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {emailCards.map((card, i) => {
          const status = statuses[card.type];
          const isLoading = sending === card.type;

          return (
            <motion.div
              key={card.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white rounded-xl border transition-all ${
                status?.ok
                  ? "border-green-200 ring-1 ring-green-100"
                  : status && !status.ok
                    ? "border-red-200 ring-1 ring-red-100"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} p-2.5 flex-shrink-0`}
                  >
                    <card.icon className="w-full h-full text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{card.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Mail className="w-3 h-3" /> Goes to: {card.recipient}
                    </span>
                  </div>
                </div>

                {/* Status message */}
                {status && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                      status.ok
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {status.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </div>

              <div className="px-6 pb-5">
                <button
                  onClick={() => sendEmail(card.type)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Test Email
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="mt-8 p-5 bg-white rounded-xl border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">ℹ️ How It Works</h3>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>
              All emails are sent to <strong>your SMTP_USER email</strong> so you can inspect both admin and customer templates in your inbox.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>
              Test data includes realistic project descriptions, budgets, and deadlines to match real-world usage.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>
              No data is saved — these are purely for testing the email delivery pipeline and template visuals.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
