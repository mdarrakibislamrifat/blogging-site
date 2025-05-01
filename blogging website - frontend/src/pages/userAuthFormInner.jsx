import { useContext, useRef, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

export default function UserAuthFormInner({ type }) {
  const authForm = useRef();
  const { userAuth, setUserAuth } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      const user = await authWithGoogle();
      const token = await user.getIdToken();
      let serverRoute = "/google-auth";
      let formData = {
        access_token: token,
      };
      userAuthThroughServer(serverRoute, formData);
    } catch (err) {
      toast.error("Trouble logging in through Google");
      console.log(err);
    }
  };

  const userAuthThroughServer = (serverRoute, formData) => {
    setIsLoading(true);

    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
        data;
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("🔥 ERROR RESPONSE:", error.response);
        const message =
          error.response?.data?.message || "Something went wrong!";
        toast.error(message);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type === "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    let form = new FormData(authForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    if (type !== "sign-in") {
      if (!fullname || fullname.length < 3) {
        return toast.error("Fullname must be at least 3 characters long");
      }
    }

    if (!email.length) {
      return toast.error("Enter Email");
    }
    if (emailRegex.test(email) === false) {
      return toast.error("Invalid Email");
    }
    if (passwordRegex.test(password) === false) {
      return toast.error(
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form
          ref={authForm}
          onSubmit={handleSubmit}
          className="w-[80%] max-w-[400px]"
        >
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome back!" : "Join us today"}
          </h1>
          {type !== "sign-in" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-br-envelope"
          />
          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-ss-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] cener"
            disabled={isLoading}
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="" className="w-5" />
            continue with google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today.
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already have an account?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
}
