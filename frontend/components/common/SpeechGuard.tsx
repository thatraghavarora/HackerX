import React, { useEffect, useState } from "react";


class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Log error for debugging
    // eslint-disable-next-line no-console
    console.error("SpeechGuard caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.props.children;
    }
    return this.props.children;
  }
}

type Props = {
  appId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function SpeechGuard({ appId, children, fallback }: Props) {
  if (typeof window === "undefined") return <>{children}</>;

  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!navigator.onLine) {
      setEnabled(false);
      return;
    }

    // Start optimistic: allow provider, but listen for unhandled rejections
    setEnabled(true);

    const onUnhandled = (ev: PromiseRejectionEvent) => {
      try {
        const reason: any = ev.reason;
        const msg = (reason && (reason.message || String(reason))) || "";
        const stack = (reason && reason.stack) || "";
        if (
          msg.includes("Failed to fetch") ||
          stack.includes("@speechly") ||
          msg.toLowerCase().includes("speechly")
        ) {
          // Prevent default devtools logging if possible and disable provider
          try {
            ev.preventDefault();
          } catch {}
          // eslint-disable-next-line no-console
          console.warn("Speechly fetch failed — disabling SpeechProvider fallback.");
          setEnabled(false);
        }
      } catch (e) {
        // ignore
      }
    };

    const onOnline = () => setEnabled(true);
    const onOffline = () => setEnabled(false);

    window.addEventListener("unhandledrejection", onUnhandled as EventListener);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandled as EventListener);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (enabled === false) return <>{children}</>;
  if (enabled === null) return <>{children}</>;

  return (
 <ErrorBoundary fallback={fallback || children}>
  {children}
</ErrorBoundary>

  );
}
