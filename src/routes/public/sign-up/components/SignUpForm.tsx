import { useState, type SubmitEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { appUserRegisterMutationOptions } from "@hooks/queryOptions";
import {
  appUserRegistrationSchema,
  type AppUserRegistration,
} from "@customTypes/appUser";
import { AppError } from "@customTypes/appError";
import logo from "@images/logo.svg";

function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: appUserRegisterMutation } = useMutation(
    appUserRegisterMutationOptions(),
  );

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validation
    const result = appUserRegistrationSchema.safeParse(data);
    if (result.error) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    // Form submission
    try {
      setIsLoading(true);
      const appUser: AppUserRegistration = {
        firstName: result.data.firstName.trim(),
        lastName: result.data.lastName.trim(),
        email: result.data.email,
        password: result.data.password,
      };
      await appUserRegisterMutation(appUser);
      navigate("/log-in");
      toast.success("Your account has been created. You can now log in.");
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 409:
            setErrorMessage("An account with this email already exists.");
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
      }

      if (err instanceof Error) {
        if (err.name === "TypeError") {
          setErrorMessage(
            "Connection failed. Please check your internet connection and try again.",
          );
          console.error(err.message);
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
          console.error(err);
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
        console.error(err);
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
      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="self-start text-sm font-medium"
              htmlFor="first-name"
            >
              First name
            </label>
            <input
              id="first-name"
              className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
              type="text"
              name="firstName"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="self-start text-sm font-medium"
              htmlFor="last-name"
            >
              Last name
            </label>
            <input
              id="last-name"
              className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
              type="text"
              name="lastName"
            />
          </div>
        </div>
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
      <div className="w-full">
        <input
          id="terms"
          type="checkbox"
          required
          aria-describedby="terms-and-policy"
          className="checkbox checkbox-xs checked:bg-accent checked:border-accent focus-within:outline-accent rounded-sm border border-solid border-slate-500 text-white transition-colors duration-200 ease-in-out [--noise:0]"
        />
        <label
          htmlFor="terms"
          className="mb-0.5 cursor-pointer pl-1.25 text-sm font-medium text-slate-700"
        >
          I agree to the Terms of Service and Privacy Policy.
        </label>
        <p id="terms-and-policy" className="py-1 text-xs text-slate-500">
          Read our
          <a
            href="#"
            className="text-accent focus-visible:ring-accent rounded-lg p-0.5 transition-all duration-200 ease-in-out hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            Terms of Service
          </a>
          and
          <a
            href="#"
            className="text-accent focus-visible:ring-accent rounded-lg p-0.5 transition-all duration-200 ease-in-out hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            Privacy Policy
          </a>
        </p>
      </div>
      {isLoading && (
        <div className="flex-center flex-col">
          <span className="loading loading-spinner text-accent w-8 sm:w-12"></span>
          <p className="text-accent mt-2 block text-sm sm:text-base">
            Creating account...
          </p>
        </div>
      )}
      <div className="w-full">
        <button
          className="bg-accent focus-visible:ring-accent hover:bg-accent/90 w-full flex-1 cursor-pointer gap-2 rounded-xl px-6 py-4 text-base font-bold text-white [transition:background-color_0.2s,box-shadow_0.1s] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="submit"
          disabled={isLoading}
        >
          <p className="mb-0.5 sm:mb-0">Sign up</p>
        </button>
        <p className="py-3 text-center text-sm font-medium text-slate-700">
          Already have an account?{" "}
          <NavLink
            to="/log-in"
            className="text-accent focus-visible:ring-accent rounded-lg p-0.5 transition-all duration-200 ease-in-out hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            Log in
          </NavLink>
        </p>
      </div>
    </form>
  );
}

export default SignUpForm;
