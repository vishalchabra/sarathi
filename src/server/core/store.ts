// Simple in-memory store (replace with Postgres later)
export type ChatMsg = { id: string; role: "user" | "assistant"; content: string; ts: number };
export type Reminder = { id: string; userId: string; title: string; fireAtISO: string; meta?: any };

const chats = new Map<string, ChatMsg[]>();    // key = userId
const reminders = new Map<string, Reminder[]>();// key = userId

export const store = {
  pushMsg(userId: string, m: ChatMsg) {
    const arr = chats.get(userId) ?? [];
    arr.push(m);
    chats.set(userId, arr);
  },
  getMsgs(userId: string, limit = 50) {
    const arr = chats.get(userId) ?? [];
    return arr.slice(-limit);
  },
  addReminder(userId: string, r: Reminder) {
    const arr = reminders.get(userId) ?? [];
    arr.push(r);
    reminders.set(userId, arr);
  },
  getReminders(userId: string) {
    return reminders.get(userId) ?? [];
  },
};
