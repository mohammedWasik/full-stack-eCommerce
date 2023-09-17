import React, { Fragment, useEffect, useRef, useState } from "react";
import "./LoginSignUp.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import {
  clearErrors,
  loginAction,
  registerAction,
} from "../../actions/userActions";
import Loader from "../Loader/Loader";

const LoginSignUp = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();

  const alert = useAlert();

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();

  const signUpNameRef = useRef();
  const signUpEmailRef = useRef();
  const signUpPasswordRef = useRef();

  const loginTab = useRef();
  const registerTab = useRef();
  const switcherTab = useRef();
  const loginLabel = useRef();
  const registerLabel = useRef();

  const [avatar, setAvatar] = useState("./Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("./Profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();

    dispatch(
      loginAction(loginEmailRef.current.value, loginPasswordRef.current.value)
    );
  };
  const registerSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", signUpNameRef.current.value);
    myForm.set("email", signUpEmailRef.current.value);
    myForm.set("password", signUpPasswordRef.current.value);
    myForm.set("avatar", avatar);
    dispatch(registerAction(myForm));
  };
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const redirect = location.search ? location.search.split("=")[1] : "/account";
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [error, alert, dispatch, isAuthenticated, navigate, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p
                    className="text-2xl font-semibold"
                    onClick={(e) => switchTabs(e, "login")}
                    ref={loginLabel}>
                    LOGIN{" "}
                  </p>
                  <p
                    className="text-2xl font-semibold"
                    onClick={(e) => switchTabs(e, "register")}
                    ref={registerLabel}>
                    REGISTER{" "}
                  </p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form
                action=""
                className="loginForm"
                ref={loginTab}
                onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <svg
                    className="mail-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="email"
                    required
                    ref={loginEmailRef}
                  />
                </div>
                <div className="loginPassword">
                  <svg
                    className="lock-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />
                  </svg>
                  <input
                    type="password"
                    placeholder="password"
                    required
                    ref={loginPasswordRef}
                  />
                </div>
                <Link to="/password/forgot">Forgot Password ?</Link>
                {/* <input type="submit" value="Login" className="loginBtn" /> */}
                <button value="Login" className="loginBtn">
                  Login
                </button>
              </form>
              <form
                action=""
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}>
                <div className="signUpName">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" />
                  </svg>{" "}
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    ref={signUpNameRef}
                  />
                </div>
                <div className="signUpEmail">
                  <svg
                    className="mail-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="email"
                    required
                    ref={signUpEmailRef}
                  />
                </div>
                <div className="signUpPassword">
                  <svg
                    className="lock-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />
                  </svg>
                  <input
                    type="password"
                    placeholder="password"
                    required
                    ref={signUpPasswordRef}
                  />
                </div>
                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <button value="Register" className="signUpBtn">
                  Register{" "}
                </button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
