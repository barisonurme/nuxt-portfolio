// server/api/contact-posts.post.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readBody } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!body.fullName || !body.email || !body.message) {
    throw createError({ statusCode: 400, statusMessage: "Missing fields" });
  }

  // Initialize Admin SDK only once
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey?.replace(/\\n/g, "\n"),
      }),
    });
  }

  const db = getFirestore();

  await db.collection("contactMessages").add({
    fullName: body.fullName,
    email: body.email,
    message: body.message,
    createdAt: new Date(),
  });

  return { success: true };
});
