import React, { Fragment, useEffect, useRef } from "react";
import Loader from "../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { clearErrors, forgotPasswordAction } from "../../actions/userActions";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const email = useRef();

  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email.current.value);
    dispatch(forgotPasswordAction(myForm));
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (message) {
      alert.success(message);
    }
  }, [error, alert, dispatch, message]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="">
            <div className="">
              <h2 className="">Forgot Password</h2>

              <form className="" onSubmit={forgotPasswordSubmit}>
                <div className="">
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    required
                    name="email"
                    ref={email}
                  />
                </div>
                <button>Send Mail</button>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
