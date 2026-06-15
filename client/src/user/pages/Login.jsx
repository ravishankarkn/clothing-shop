import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");

  const [forgotMode, setForgotMode] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isLogin) {

        const response =
          await axios.post(

            "http://localhost:5000/auth/login",

            {
              email: formData.email.trim().toLowerCase(),
              password: formData.password.trim()
            }

          );

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "role",
          response.data.role
        );

        localStorage.setItem(
          "name",
          response.data.name
        );

        localStorage.setItem("userId", response.data.id);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            name: response.data.name
          })
        );

        navigate(
          response.data.role === "admin"
            ? "/admin"
            : "/"
        );

      } else {

        const response =
          await axios.post(

            "http://localhost:5000/auth/register",

            {
              name: formData.name.trim(),
              email: formData.email.trim().toLowerCase(),
              password: formData.password.trim()
            }

          );

        toast.info(response.data.message);

        setVerifyEmail(
          formData.email
        );

        setShowOtp(true);

        setTimer(60);

        setCanResend(false);

      }

    }

    catch (error) {

      const message =
        error?.response?.data?.message;

      if (
        message === "Verify your email first"
      ) {

        setShowOtp(true);

        setVerifyEmail(
          formData.email
        );

        setTimer(60);

        return;

      }

      if (
        message === "Invalid Email"
      ) {

        toast.info(
          "Account not found. Please register."
        );

        setIsLogin(false);

        return;

      }

      toast.error(
        message ||
        "Something went wrong"
      );

    }

  };

  const verifyOtp = async () => {

    try {

      const response =
        await axios.post(

          "http://localhost:5000/auth/verify",

          {
            email: verifyEmail,
            otp: otp.trim()
          }

        );

      toast.info(
        response.data.message
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "name",
        response.data.name
      );

      localStorage.setItem(

        "user",

        JSON.stringify({

          id:
            response.data.id,

          name:
            response.data.name

        })

      );

      navigate("/");
      toast.info(
        response.data.message
      );

      setShowOtp(false);

      setOtp("");

      setIsLogin(true);

    }

    catch (error) {

      toast.error(

        error
          ?.response
          ?.data
          ?.message ||

        "Invalid OTP"

      );

    }

  };

  const sendForgotOtp =
    async () => {

      try {

        const response =
          await axios.post(

            "http://localhost:5000/auth/forgot-password",

            {
              email:
                formData.email
                  .trim()
                  .toLowerCase()
            }

          );

        toast.info(
          response.data.message
        );

        setForgotMode(true);

        setShowOtp(true);

        setVerifyEmail(
          formData.email
        );

        setTimer(60);

        setCanResend(false);

      }

      catch (error) {

        toast.error(

          error
            ?.response
            ?.data
            ?.message ||

          "Failed"

        );

      }

    };

  const resetPassword =
    async () => {

      try {

        const response =
          await axios.post(

            "http://localhost:5000/auth/reset-password",

            {
              email: verifyEmail,
              otp,
              password: newPassword
            }

          );

        toast.info(
          response.data.message
        );

        setForgotMode(false);

        setShowOtp(false);

        setOtp("");

        setNewPassword("");

        setIsLogin(true);

      }

      catch (error) {

        toast.error(

          error
            ?.response
            ?.data
            ?.message ||

          "Failed"

        );

      }

    };

  useEffect(() => {

    let interval;

    if (
      showOtp &&
      timer > 0
    ) {

      interval =
        setInterval(() => {

          setTimer(
            (prev) =>
              prev - 1
          );

        }, 1000);

    }

    if (
      timer === 0
    ) {

      setCanResend(true);

    }

    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    showOtp,
    timer
  ]);

  const resendOtp =
    async () => {

      try {

        await axios.post(

          "http://localhost:5000/auth/forgot-password",

          {
            email: verifyEmail
          }

        );

        setTimer(60);

        setCanResend(false);

        toast.info(
          "OTP Resent"
        );

      }

      catch {

        toast.error(
          "Failed"
        );

      }

    };

  return (

    <div className="auth-page">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <h1>

          {
            showOtp
              ? "Verify Email"
              : isLogin
                ? "Login"
                : "Register"
          }

        </h1>

        {

          !showOtp &&
          !isLogin && (

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />

          )

        }

        {

          !showOtp && (

            <>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              <div className="password-box">

                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  name="password"

                  placeholder="Password"

                  value={formData.password}

                  onChange={handleChange}

                />

                <span

                  className="eye-icon"

                  onClick={() =>

                    setShowPassword(
                      !showPassword
                    )

                  }

                >

                  {
                    showPassword
                      ? "🙈"
                      : "👁️"
                  }

                </span>

              </div>

              <button type="submit">

                {
                  isLogin
                    ? "Login"
                    : "Register"
                }

              </button>

              {

                isLogin && (

                  <p

                    style={{
                      color: "blue",
                      cursor: "pointer"
                    }}

                    onClick={
                      sendForgotOtp
                    }

                  >

                    Forgot Password?

                  </p>

                )

              }

            </>

          )

        }

        {

          showOtp && (

            <>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                  )}
              />

              {

                forgotMode && (

                  <div className="password-box">

                    <input

                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }

                      placeholder="New Password"

                      value={newPassword}

                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )}

                    />

                    <span

                      className="eye-icon"

                      onClick={() =>

                        setShowNewPassword(
                          !showNewPassword
                        )

                      }

                    >

                      {
                        showNewPassword
                          ? "🙈"
                          : "👁️"
                      }

                    </span>

                  </div>

                )

              }

              <button
                type="button"
                onClick={
                  forgotMode
                    ?
                    resetPassword
                    :
                    verifyOtp
                }
              >

                {
                  forgotMode
                    ?
                    "Reset Password"
                    :
                    "Verify OTP"
                }

              </button>

              <p>

                {
                  canResend
                    ?

                    (

                      <span

                        style={{
                          color: "blue",
                          cursor: "pointer"
                        }}

                        onClick={
                          resendOtp
                        }

                      >

                        Resend OTP

                      </span>

                    )

                    :

                    `Resend in ${timer}s`

                }

              </p>

            </>

          )

        }

        <p>

          {
            isLogin
              ?
              "Don't have account?"
              :
              "Already have account?"
          }

          <span

            style={{
              color: "blue",
              cursor: "pointer",
              marginLeft: "8px"
            }}

            onClick={() => {

              setIsLogin(
                !isLogin
              );

              setShowOtp(false);

              setOtp("");

            }}

          >

            {
              isLogin
                ?
                "Register"
                :
                "Login"
            }

          </span>

        </p>

      </form>

    </div>

  );

};

export default Login;

