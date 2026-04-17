import { useState, type SubmitEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@contexts/AuthProvider";
import {
  appUserCredentialsSchema,
  type AppUserCredentials,
} from "@customTypes/appUser";
import { AppError } from "@customTypes/appError";
import useRedirectIfAuthenticated from "@hooks/useRedirectIfAuthenticated";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import logo from "@images/logo.svg";

function LogInForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useRedirectIfAuthenticated();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validation
    const result = appUserCredentialsSchema.safeParse(data);
    if (result.error) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    // Form submission
    try {
      setIsLoading(true);
      const appUser: AppUserCredentials = {
        email: result.data.email,
        password: result.data.password,
      };
      await login(appUser);
      navigate("/workspaces");
      toast.info("You've successfully logged in.");
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 401:
            setErrorMessage("Invalid email or password.");
            break;
          case 400:
            setErrorMessage(
              "Something went wrong while submitting the form. Please try again.",
            );
            break;
          default:
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
        console.error(err.message);
      } else {
        const errorMessage = getUnexpectedFormErrorMessage(err);
        setErrorMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      id="submit-form"
      onSubmit={(e) => handleSubmit(e)}
      className="shadow-elevation-high xs:p-8 flex-center xs:min-h-0 min-h-svh w-full max-w-120.5 flex-col gap-6 rounded-lg bg-white px-4 py-8"
    >
      <img src={logo} alt="Flowspace logo" className="mx-auto" />
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="self-start text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
            type="text"
            name="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="self-start text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
            type="password"
            name="password"
          />
        </div>
      </div>
      {errorMessage && (
        <div className="w-full">
          <p className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white">
            * {errorMessage}
          </p>
        </div>
      )}
      {isLoading && (
        <div className="flex-center flex-col">
          <span className="loading loading-spinner text-accent w-8 sm:w-12"></span>
          <p className="text-accent mt-2 block text-sm sm:text-base">
            Logging in...
          </p>
        </div>
      )}
      <div className="w-full">
        <button
          className="bg-accent focus-visible:ring-accent hover:bg-accent/90 w-full flex-1 cursor-pointer rounded-xl px-6 py-4 text-base font-bold text-white [transition:background-color_0.2s,box-shadow_0.1s] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="submit"
          disabled={isLoading}
        >
          <p className="mb-0.5 sm:mb-0">Log in</p>
        </button>
        <p className="py-3 text-center text-sm font-medium text-slate-700">
          Don't have an account?{" "}
          <NavLink
            to="/sign-up"
            className="text-accent focus-visible:ring-accent rounded-lg p-0.5 transition-all duration-200 ease-in-out hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            Sign up
          </NavLink>
        </p>
      </div>
    </form>
  );
}

export default LogInForm;
