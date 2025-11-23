import type { Firestore} from "firebase/firestore";
import { addDoc, collection, serverTimestamp, getFirestore } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig() 

  const body = await readBody(event);

  if (!body.fullName || !body.email || !body.message) {
    throw createError({ statusCode: 400, statusMessage: "Missing fields" });
  }

  const firebaseConfig = {
    apiKey: config.public.apiKey as string,
    authDomain: config.public.authDomain as string,
    projectId: config.public.projectId as string,
    storageBucket: config.public.storageBucket as string,
    messagingSenderId: config.public.messagingSenderId as string,
    appId: config.public.appId as string,
  };

  if (!getApps().length) initializeApp(firebaseConfig);

  const db: Firestore = getFirestore(); 

  await addDoc(collection(db, "messages"), {
    name: body.fullName,
    email: body.email,
    message: body.message,
    createdAt: serverTimestamp(),
  });

  return { success: true };
});
