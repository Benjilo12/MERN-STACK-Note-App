import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosinstance";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    //email validation
    if (!validateEmail(email)) {
      setError("please enter a valid address");
      return;
    }

    //validation for password
    if (!password) {
      setError("please enter the password");
      return;
    }

    setError("");

    //Login API CALL
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      //Handle sucessful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      //handle error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured.please try again");
      }
    }
  };
  return (
    <>
      <div className="flex h-full items-center justify-center mt-45">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7 font-bold">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1 mb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="mt-2">
              Not registered yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-blue-500 underline"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
