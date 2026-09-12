import { Form } from "reactstrap";
import React, { useRef } from "react";
import { login } from "../store/auth-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";

export const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const loginData = await performLogin(email, password);

    if (loginData) {
      dispatch(login(loginData.token));
      navigate("/home");
    }
  };

  const performLogin = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data) {
      return data;
    }

    return undefined;
  };

  return (
    <div>
      <Form>
        <div className="container-fluid">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-12">
              <div
                className="card bg-dark text-white my-5 mx-auto border-1"
                style={{ borderRadius: "1rem", maxWidth: "400px" }}
              >
                <div className="card-body p-5 d-flex flex-column align-items-center mx-auto w-100">
                  <h2>Login</h2>
                  <p>Please Enter your login and password!</p>

                  <input
                    className="mb-2 mx-5 w-100 form-control"
                    aria-label="email-adress"
                    type="email"
                    placeholder="user@email.com"
                    ref={emailRef}
                  />
                  <p className="text-white-50 mb-5">Email adress:</p>
                  <input
                    className="mb-2 mx-5 w-100 form-control"
                    aria-label="password"
                    type="password"
                    placeholder="********"
                    ref={passwordRef}
                  />
                  <p className="text-white-50 mb-5">Password:</p>
                  <button
                    type="submit"
                    className="btn btn-outline-light mx-2 px-5 text-white g-lg-4"
                    onClick={handleLoginSubmit}
                  >
                    Login
                  </button>
                  <div>
                    <p className="mt-2">
                      Don't have an account?
                      <Link to="/register" className="text-white-50 fw-bold">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
