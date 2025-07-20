// src\utils\visitorId.ts

export function getVisitorId(): string {
  // Use localStorage so ID stays for this browser
  let id = localStorage.getItem("visitorId");
  if (!id) {
    id = crypto.randomUUID(); // or use uuid lib
    localStorage.setItem("visitorId", id);
  }
  return id;
}
