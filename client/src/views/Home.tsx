import { useEffect, useState } from "npm:react@19.1.0";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl mb-8">Welcome</h1>
      <div className="flex gap-4">
        <RequestButton />
        <SubscribeButton />
      </div>
      <div className="mt-4 flex gap-4">
        <NotifyMeButton />
        <NotifyAllButton />
      </div>
    </div>
  );
}
function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = self.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function RequestButton() {
  const [canRequest, setCanReqeust] = useState(
    Notification.permission === "default",
  );

  const request = async () => {
    setCanReqeust(false);
    const result = await Notification.requestPermission();
    if (result === "denied") {
      alert("Push notifactions denied!");
    } else {
      alert("Push notifications allowd!");
    }

    setCanReqeust(true);
  };
  return (
    <button type="button" disabled={!canRequest} onClick={request}>
      Request permission
    </button>
  );
}

function NotifyAllButton() {
  const panic = () => fetch("/api/notify-all");

  return (
    <button type="button" className="bg-red-600" onClick={panic}>PANIC!</button>
  );
}
function NotifyMeButton() {
  const notifyMe = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscribed = await registration!.pushManager.getSubscription();
    if (!subscribed) return;
    fetch("/api/notify-me", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ endpoint: subscribed.endpoint }),
    });
  };
  return <button type="button" onClick={notifyMe}>Notify Me!</button>;
}

function SubscribeButton() {
  const [subState, setSubState] = useState<
    "pending" | "subscribed" | "not-subscribed"
  >("pending");
  const [subscribeDisabled, setSubscribeDisabled] = useState(false);

  const result = Notification.permission;

  if (result === "denied") {
    console.error("The user explicitly denied the permission request.");
    return null;
  }

  if (result === "granted") {
    console.info("The user accepted the permission request.");
  }

  useEffect(() => {
    navigator.serviceWorker.getRegistration().then((registration) =>
      registration
        ? registration?.pushManager.getSubscription()
        : Promise.resolve(null)
    ).then((subscribed) =>
      setSubState(subscribed ? "subscribed" : "not-subscribed")
    );
  }, []);

  const subscribe = async () => {
    setSubscribeDisabled(true);
    const registration = await navigator.serviceWorker.getRegistration();
    const subscribed = await registration!.pushManager.getSubscription();
    if (subscribed) {
      console.info("User is already subscribed.");
      setSubState("subscribed");
      setSubscribeDisabled(false);
      // notifyMeButton.disabled = false;
      // unsubscribeButton.disabled = false;
      return;
    }
    const subscription = await registration!.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        "BGT8ESvdA0ZRFznRcxj3b-_nj0ziBYbKG4W5WB5_6-wFsRt8OCXjTBbheN8-PHcHu-Ce2fBKBYV2o6UpMi3f810",
      ),
    });
    // notifyMeButton.disabled = false;
    fetch("/api/add-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    }).then(() => setSubState("subscribed"));
    setSubscribeDisabled(false);
  };

  const unsubscribe = async () => {
    setSubscribeDisabled(true);
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    const unsubscribed = await subscription?.unsubscribe();
    if (unsubscribed) {
      await fetch("/api/remove-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint: subscription?.endpoint }),
      });
      console.info("Successfully unsubscribed from push notifications.");
    }
    setSubState("not-subscribed");
    setSubscribeDisabled(false);
  };

  const getSubText = () => {
    switch (subState) {
      case "subscribed":
        return "Unsubscribe";
      case "not-subscribed":
        return "Subscribe";
      default:
        return "Loading...";
    }
  };
  return (
    <button
      type="button"
      disabled={subState === "pending" || subscribeDisabled}
      onClick={subState === "subscribed" ? unsubscribe : subscribe}
    >
      {getSubText()}
    </button>
  );
}
