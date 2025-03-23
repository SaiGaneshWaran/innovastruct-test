import { Link } from 'react-router-dom';

const ChooseLogin = () => {
  return (
    <div className="relative flex flex-col justify-center min-h-screen bg-gray-100">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-yellow-400 lg:max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-8">
          Choose Login Type
        </h1>
        <div className="space-y-4">
          <Link
            to="/client/login"
            className="btn btn-neutral btn-block bg-blue-500 hover:bg-blue-600 text-white"
          >
            Client Login
          </Link>
          <Link
            to="/company/login"
            className="btn btn-neutral btn-block bg-green-500 hover:bg-green-600 text-white"
          >
            Company Login
          </Link>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseLogin;