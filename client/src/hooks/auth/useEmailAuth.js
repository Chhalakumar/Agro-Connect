import React from "react";
import useHttpClient from "../api/useHttpClient";
import { LOGIN, SIGNUP, VERIFY } from "../../constants/apiEndpoints";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const useEmailAuth = () => {
  const navigate = useNavigate();
  const { sendRequest, isLoading } = useHttpClient();
  const [cookies, setCookie, removeCookie] = useCookies([
    "user_access_token",
    "seller_access_token",
  ]);

  const handleSignup = async (type, formData) => {
    try {
      // Clear the opposite role's token before signing up
      if (type === "seller") {
        removeCookie("user_access_token", { path: "/" });
      } else {
        removeCookie("seller_access_token", { path: "/" });
      }

      const response = await sendRequest(SIGNUP(type), "POST", formData);
      
      // After successful signup, redirect to OTP verification
      if (response?.data?.email) {
        navigate(`/${type}/verify-otp?email=${encodeURIComponent(response.data.email)}&type=${type}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (type, formData) => {
    try {
      // Clear the opposite role's token before logging in
      if (type === "seller") {
        removeCookie("user_access_token", { path: "/" });
      } else {
        removeCookie("seller_access_token", { path: "/" });
      }

      const response = await sendRequest(LOGIN(type), "POST", formData);
      
      // Check if OTP verification is required
      if (response?.data?.requiresVerification) {
        // Redirect to OTP verification page with email
        navigate(`/${type}/verify-otp?email=${encodeURIComponent(formData.email)}&type=${type}`);
        return;
      }
      
      // Normal login flow
      if (type === "seller") {
        navigate("/sellerdashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyAccount = async (type, token) => {
    try {
      const resp = await sendRequest(
        VERIFY(type, token),
        "PATCH",
        null,
        null,
        false
      );
      return resp.status;
    } catch (error) {
      console.log(error);
      return error.response?.status || 500;
    }
  };

  return { isLoading, handleSignup, handleLogin, verifyAccount };
};

export default useEmailAuth;
