import { Form } from "reactstrap";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";

export const RegisterCustomer = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const navigate = useNavigate();
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const registerData = await performRegister(
      firstName,
      lastName,
      email,
      password,
    );

    if (registerData) {
      /* need to check EmailIsAlreadyInUse beforehand! */
      navigate("/login");
    }
  };

  const performRegister = async (firstName, lastName, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register-customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    const data = (await response).json();

    if (!response.ok) {
      navigate("/register-customer");
    } else {
      if (response.ok) {
        return data;
      }
    }

    return undefined;
  };

  return (
    <div>
      <Form onSubmit={handleRegisterSubmit}>
        <div className="container-fluid">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-12">
              <div
                className="card bg-dark text-white my-5 mx-auto border-1"
                style={{ borderRadius: "1rem", maxWidth: "400px" }}
              >
                <div className="card-body p-5 d-flex flex-column align-items-center mx-auto w-100">
                  <h2>Register</h2>
                  <p>Please Enter your Personal Information:</p>

                  <input
                    className="mb-2 mx-5 w-100 form-control"
                    aria-label="first name"
                    type="text"
                    placeholder="name"
                    ref={firstNameRef}
                  />
                  <p className="text-white-50 mb-4">First name</p>
                  <input
                    className="mb-2 mx-4 w-100 form-control"
                    aria-label="last name"
                    type="text"
                    placeholder="surname"
                    ref={lastNameRef}
                  />
                  <p className="text-white-50 mb-4">Last name</p>
                  <input
                    className="mb-2 mx-4 w-100 form-control"
                    aria-label="email-adress"
                    type="email"
                    placeholder="user@email.com"
                    ref={emailRef}
                  />
                  <p className="text-white-50 mb-4">Email adress</p>
                  <input
                    className="mb-2 mx-5 w-100 form-control"
                    aria-label="password"
                    type="password"
                    placeholder="********"
                    ref={passwordRef}
                  />
                  <p className="text-white-50 mb-4">password</p>

                  <button className="btn btn-outline-light mx-2 px-4 text-white g-lg-4">
                    Sign up
                  </button>
                  <div>
                    <p className="mt-2">
                      Already a user?
                      <Link to="/login" className="text-white-50 fw-bold">
                        Login
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
