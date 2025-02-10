import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth, db } from "../firebase";
import { FirebaseError } from "firebase/app";

import { collection, getDocs } from "firebase/firestore";

export interface FirebaseUserDataType {
  displayName: null | string;
  email: string;
  subscription: boolean;
}

export const login = async (
  email: string,
  password: string,
): Promise<{ error?: string } | { data?: UserCredential }> => {
  try {
    console.log("passed email to this function is =>", email);

    const response: UserCredential = await signInWithEmailAndPassword(auth, email, password);

    return { data: response };
  } catch (error: any) {
    console.log("raw error is =>", error);

    if (error instanceof FirebaseError) {
      let message = "An unknown error occurred";

      switch (error.code as string) {
        case "auth/invalid-credential":
          message = "One or, both of your credentials are wrong.";
          break;
        case "auth/invalid-email":
          message = "Invalid email format. Please check your email.";
          break;
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed attempts. Please try again later.";
          break;

        default:
          break;
      }

      return { error: message };
    }
    return { error: "Something went wrong. Please, try again." };
  }
};

export const getRecentlyJoinedUsers = async () => {
  const dataReference = await getDocs(collection(db, "users"));
  const users: FirebaseUserDataType[] = [];

  dataReference.forEach((doc) => {
    console.log(`${doc.id} => `, doc.data());

    if (doc.data()) {
      users.push({
        email: doc.data().email,
        displayName: doc.data().displayName,
        subscription: doc.data().subscription,
      });
    }
  });

  return users;
};
