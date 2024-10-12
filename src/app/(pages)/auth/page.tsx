"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (mode === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [mode]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    router.push(`/auth?mode=${isLogin ? "signup" : "login"}`); // Update URL without reloading the page
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login/signup logic here
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    console.log(data); // For demo purposes, log the form data
  };

  const formFields =isLogin ?[{ name: "username", type: "text", required: true },{ name: "password", type: "password", required: true }]: [{ name: "username", type: "text", required: true }, { name: "email", type: "email", required: true },
    { name: "password", type: "password", required: true },{ name: "confirmPassword", type: "password", required: !isLogin },];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          {formFields.map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
              </label>
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
