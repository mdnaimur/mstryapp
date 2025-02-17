"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  console.log("this is seeesion inside page", session);
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-400 p-2 rounded-lg" onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
}
