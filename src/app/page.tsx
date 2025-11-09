"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { authClient } from "@/lib/auth-client"; //import the auth client

import { useState } from "react";

export default function Home() {
  const {data: session} = authClient.useSession();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setpassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password,
    }, {
      onError: () => {
        window.alert("error creating user");
      },
      onSuccess: () => {
        window.alert("user created successfully");
      }
    });
  }

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onError: () => {
        window.alert("something went wrong");
      },
      onSuccess: () => {
        window.alert("success");
      }
    });
  }

  if(session){
    return(
      <div className="flex flex-col p-4 gap-y-4">
        <p>signed in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>sign out</Button>
      </div>
    )
  }

  return(
    <div className="flex flex-col gap-y-10">
      <div className="p-4 flex flex-col gap-y-4">
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setpassword(e.target.value)} />

        <Button onClick={onSubmit}>
          create user
        </Button>
      </div>

      <div className="p-4 flex flex-col gap-y-4">
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setpassword(e.target.value)} />

        <Button onClick={onLogin}>
          Login
        </Button>
      </div>
    </div>
  )
}