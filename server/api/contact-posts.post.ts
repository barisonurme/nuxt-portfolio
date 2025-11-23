import type { Firestore } from "firebase/firestore";
import { addDoc, collection, serverTimestamp, getFirestore } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

interface RecaptchaResponse {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  "error-codes"?: string[]
}


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { fullName, email, message, captchaToken } = body;

  if (!fullName || !email || !message || !captchaToken) {
    throw createError({ statusCode: 400, statusMessage: "Missing fields" });
  }

  /* 
  *
  *
  * CAPTCHA VALIDATION
  * 
  * 
  * */
  const secret = config.captchaSecretKey; 

  const captchaRes = await $fetch<RecaptchaResponse>(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      params: {
        secret,
        response: captchaToken,
      },
    }
  );


  if (!captchaRes.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Captcha Failed",
    });
  }

  /* 
  *
  *
  * FIREBASE INITIALIZATION
  * 
  * 
  * */
  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
  };

  if (!getApps().length) initializeApp(firebaseConfig);
  const db: Firestore = getFirestore();

  await addDoc(collection(db, "messages"), {
    name: fullName,
    email,
    message,
    createdAt: serverTimestamp(),
  });

  return { success: true };
});
