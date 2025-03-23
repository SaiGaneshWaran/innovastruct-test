import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userService from "../../services/userService";

function CompanyLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First check if user exists and get their role
      const userResponse = await userService.getUserByEmail(credentials.email);

      // Check if user exists and has correct role
      if (!userResponse) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      if (userResponse.role !== "COMPANY") {
        setError(
          <div className="space-y-2">
            <p>This login page is for companies only.</p>
            <p>If you are a client, please
              <Link to="/client/login" className="text-blue-600 hover:underline mx-1">
                login here
              </Link>
              instead.
            </p>
          </div>
        );
        return;
      }

      // Proceed with login only if role is correct
      const response = await userService.login(credentials.email, credentials.password);
      navigate("/company/home");

    } catch (err) {
      if (err.response?.status === 404) {
        setError("No account found with this email address.");
      } else {
        setError("Invalid email or password. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen bg-gray-100">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-green-400 lg:max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Company Login
        </h1>
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="btn btn-neutral btn-block bg-green-500 hover:bg-green-600"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
          <div className="text-center mt-4 space-y-2">
            <Link to="/" className="text-blue-600 hover:underline block">
              Back to Login Selection
            </Link>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyLogin;