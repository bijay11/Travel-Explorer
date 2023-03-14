"use client";
import { useRef } from "react";

export default function Signup() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const signup = async () => {
    try {
      const data = await fetch("http://localhost:8000/api/v1/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameRef.current?.value,
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
          passwordConfirm: passwordConfirmRef.current?.value,
        }),
      });
    } catch (error) {
      console.error("signup error", error);
    }
  };
  return (
    <form>
      <label>Name</label>
      <input type="text" placeholder="name@example.com" ref={nameRef} />

      <label>Email address</label>
      <input type="email" placeholder="name@example.com" ref={emailRef} />

      <label>Password</label>
      <input type="password" ref={passwordRef} autoComplete="off" />

      <label>Confirm Password</label>
      <input type="password" ref={passwordConfirmRef} autoComplete="off" />

      <button onClick={signup}>Submit</button>
    </form>
  );
}
