export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return;
  }

  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
}

export function showNotification(message: string) {
  if (Notification.permission === "granted") {
    new Notification("Pomodoro Timer", {
      body: message,
      icon: "/favicon.ico"
    });
  }
}
