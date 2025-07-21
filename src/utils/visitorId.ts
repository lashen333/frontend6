export function getVisitorId(): string {
  if (typeof window === "undefined") return ""; // SSR-safe

  let id = localStorage.getItem("visitorId");
  if (!id) {
    if (crypto?.randomUUID) {
      id = crypto.randomUUID();
    } else {
      id = Math.random().toString(36).substring(2) + Date.now();
    }
    localStorage.setItem("visitorId", id);
  }
  return id;
}
