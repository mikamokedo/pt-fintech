import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthContext";
import { useKeyboardEvent } from "../hooks/useKeyboard";
import { loginService, getProfileService } from "../services/auth.services";
import { axiosInstance } from "../services/backendServices";

interface FormData {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [isFailed, setIsFailed] = React.useState("");

  const onSubmit = async (data: FormData) => {
    setIsFailed("");
    try {
      const loginRes = await loginService(data.username, data.password);
      const token = loginRes.access_token;
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const profile = await getProfileService();
      login(profile);
      navigate("/");
      localStorage.setItem("token", token);
    } catch (error: any) {
      setIsFailed(error.message);
    }
  };
  useKeyboardEvent(() => onSubmit(getValues()));

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <p className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">PT FINTECH todo</p>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your username
                  </label>
                  <input
                    type="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    {...register("username", { required: true })}
                  />
                  {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Your Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("password", { required: true })}
                  />
                  {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                {isFailed && <div className="text-red-500 text-sm text-center">Username or password is invalid</div>}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
