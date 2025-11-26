import { db } from "@/firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function addUserNotification(userId: string, notification: any) {
  await addDoc(collection(db, "users", userId, "notifications"), {
    ...notification,
    date: Timestamp.now(),
    read: false,
  });
}