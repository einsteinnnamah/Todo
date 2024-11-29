"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export const TestNotification: React.FC = () => {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const sendTestNotification = async () => {
    if (!user?.id) {
      setStatus("❌ No user logged in");
      return;
    }

    setIsLoading(true);
    setStatus("Starting notification test...");

    try {
      // 1. Check OneSignal
      if (typeof window === "undefined" || !window.OneSignal) {
        setStatus("❌ OneSignal not found");
        throw new Error("OneSignal not initialized");
      }
      setStatus("✓ OneSignal found");

      // 2. Set external user ID (using Supabase user ID)
      await window.OneSignal.login(user.id);
      setStatus("✓ User identified with OneSignal");

      // 3. Check push support
      const isPushSupported =
        await window.OneSignal.Notifications.isPushSupported();
      if (!isPushSupported) {
        setStatus("❌ Push notifications not supported");
        throw new Error("Push notifications not supported");
      }
      setStatus("✓ Push notifications are supported");

      // 4. Check and request permission if needed
      const permission = await window.OneSignal.Notifications.permission;
      if (!permission) {
        setStatus("Requesting permission...");
        const granted =
          await window.OneSignal.Notifications.requestPermission();
        if (!granted) {
          setStatus("❌ Permission denied");
          throw new Error("Notification permission denied");
        }
      }
      setStatus("✓ Permission granted");

      // 5. Get subscription
      setStatus("Getting subscription...");
      await window.OneSignal.login(user.id);

      // Wait a moment for subscription to be ready
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const subscription = window.OneSignal.User.pushSubscription;
      if (!subscription || !subscription.id) {
        setStatus("❌ No subscription found");
        throw new Error("No subscription found");
      }
      setStatus(`✓ Got subscription: ${subscription.id}`);

      // 6. Send test notification
      setStatus("Sending notification...");
      const response = await fetch("/api/send-test-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: subscription.id,
          title: "Test Notification",
          message: `Hello ${user.email}! This is a test notification.`,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        setStatus(`❌ Error: ${data.error || "Failed to send"}`);
        throw new Error(data.error || "Failed to send notification");
      }

      setStatus("✅ Notification sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      setStatus(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={sendTestNotification}
        disabled={isLoading}
        className={`w-full px-4 py-2 rounded text-white transition-colors ${
          isLoading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Sending..." : "Send Test Notification"}
      </button>

      {status && (
        <div
          className={`text-sm mt-2 p-3 rounded border ${
            status.includes("❌")
              ? "bg-red-50 border-red-200 text-red-700"
              : status.includes("✅")
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          {status}
        </div>
      )}

      {/* Debug information */}
      <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500">
        <div>User ID: {user?.id}</div>
        <div>User Email: {user?.email}</div>
        <div>
          Auth Status: {loading ? "Loading" : user ? "Logged In" : "Logged Out"}
        </div>
        <div>
          OneSignal Available:{" "}
          {typeof window !== "undefined" && window.OneSignal ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};
