import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userService from "../../services/userService";
import companyService from "../../services/companyService";

function Register() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "CLIENT", // Default role
    companyType: "", // New field for company type
    shortDescription: "", // New field for company description
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateForm = () => {
    // Check if passwords match
    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Check if password is strong enough (at least 6 characters)
    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // Check if all required fields are filled
    if (!userData.email || !userData.password || !userData.name) {
      setError("All fields are required");
      return false;
    }

    // Additional validation for company registration
    if (userData.role === "COMPANY") {
      if (!userData.companyType) {
        setError("Company type is required");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = userData;

      // If registering as a company, create company profile first
      let companyId = null;
      if (userData.role === "COMPANY") {
        const companyData = {
          name: userData.name,
          shortDescription: userData.shortDescription,
          type: userData.companyType,
          rating: 0.0,
          services: [],
          projects: [],
          reviews: []
        };
        const companyResponse = await companyService.createCompany(companyData);
        companyId = companyResponse.id;
      }

      // Add companyId to registration data if it's a company
      if (companyId) {
        registrationData.companyId = companyId;
      }

      // Register user
      const response = await userService.register(registrationData);

      // Navigate to appropriate login page based on user role
      if (userData.role === "CLIENT") {
        navigate("/client/login");
      } else if (userData.role === "COMPANY") {
        navigate("/company/login");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Email already exists. Please use a different email.");
      } else {
        setError("Registration failed. Please try again.");
        console.error("Registration error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen bg-gray-100">
      <div className={`w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ${
        userData.role === "COMPANY" ? "ring-green-400" : "ring-blue-400"
      } lg:max-w-lg`}>
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Register {userData.role === "COMPANY" ? "Company" : "Client"}
        </h1>
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                userData.role === "COMPANY" ? "focus:ring-green-400" : "focus:ring-blue-400"
              }`}
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                userData.role === "COMPANY" ? "focus:ring-green-400" : "focus:ring-blue-400"
              }`}
              value={userData.email}
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
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                userData.role === "COMPANY" ? "focus:ring-green-400" : "focus:ring-blue-400"
              }`}
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                userData.role === "COMPANY" ? "focus:ring-green-400" : "focus:ring-blue-400"
              }`}
              value={userData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              name="role"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                userData.role === "COMPANY" ? "focus:ring-green-400" : "focus:ring-blue-400"
              }`}
              value={userData.role}
              onChange={handleChange}
              required
            >
              <option value="CLIENT">Client</option>
              <option value="COMPANY">Company</option>
            </select>
          </div>

          {/* Company-specific fields */}
          {userData.role === "COMPANY" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Type
                </label>
                <select
                  name="companyType"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={userData.companyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Company Type</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Description
                </label>
                <textarea
                  name="shortDescription"
                  placeholder="Brief description of your company"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[100px]"
                  value={userData.shortDescription}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className={`btn btn-block text-white border-0 ring-2 ${
              userData.role === "COMPANY"
                ? "bg-green-500 hover:bg-green-600 ring-green-400"
                : "bg-blue-500 hover:bg-blue-600 ring-blue-400"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;