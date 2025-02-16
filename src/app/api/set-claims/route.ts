import admin, { ServiceAccount } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

import serviceAccount from "@/utils/wittyworkbook-auth-secret.json";

if (!admin.apps.length) {
  console.log("got an admin app");
  //   admin.initializeApp({
  //     credential: admin.credential.cert({
  //       projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  //       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  //       privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  //     }),
  //   });

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("got uid from set-claims api =>", uid);

    // Assign custom claim 'authenticated'
    await admin.auth().setCustomUserClaims(uid, { role: "authenticated" });
    console.log("the admin claim now =>", await admin.auth().getUser(uid));

    return NextResponse.json({ message: "User role assigned successfully" }, { status: 200 });
  } catch (error: any) {
    console.log("the error in server side =>", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
