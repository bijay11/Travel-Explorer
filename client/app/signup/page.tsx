"use client";
import { useRef } from "react";

export default function Signup() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const signup = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/signup`,
        {
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
        }
      );
    } catch (error) {
      console.error("signup error", error);
    }
  };
  return (
    <div className="container mt-5" style={{ width: "750px" }}>
      <div className="card">
        <div className="card-body">
          <h5>Sign In</h5>
          <hr />
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="John Doe"
                    ref={nameRef}
                  />
                  <label htmlFor="floatingName">Name</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    placeholder="name@example.com"
                    ref={emailRef}
                  />
                  <label htmlFor="floatingEmail">Email address</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    ref={passwordRef}
                    autoComplete="off"
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPasswordConfirm"
                    placeholder="Password"
                    ref={passwordConfirmRef}
                    autoComplete="off"
                  />
                  <label htmlFor="floatingPasswordConfirm">
                    ConfirmPassword
                  </label>
                </div>
              </div>
            </div>
            <div className="text-end">
              <button type="button" className="btn btn-outline-info">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
