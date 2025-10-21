import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Login2faInit, Login2faVerify } from "../api/user";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState("credentials");
  const [email, setEmail] = useState("");

  const onSubmitCredentials = async (values) => {
    try {
      dispatch(showLoading());
      const response = await Login2faInit(values);
      if (response?.success) {
        message.success(response?.message || "OTP sent to your email");
        setEmail(values.email);
        setStep("otp");
      } else {
        message.warning(response?.message);
      }
    } catch (error) {
      message.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const onSubmitOtp = async (values) => {
    try {
      dispatch(showLoading());
      const response = await Login2faVerify({ email, otp: values.otp });
      if (response?.success) {
        message.success(response?.message || "Login successful");
        // Keep for backward compatibility if parts of app still read from localStorage
        if (response?.data) {
          localStorage.setItem("tokenForBMS", response?.data);
        }
        navigate("/");
      } else {
        message.warning(response?.message || "Invalid OTP");
      }
    } catch (error) {
      message.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };
  return (
    <div className="App-header">
      <main className="main-area mw-500 text-center px-3">
        <section>
          <h1>Login to BookMyShow</h1>
        </section>
        <section>
          {step === "credentials" && (
            <Form layout="vertical" onFinish={onSubmitCredentials}>
              <Form.Item
                label="Email"
                htmlFor="email"
                name="email"
                className="d-block"
                rules={[{ required: true, message: "Email is Required" }]}
              >
                <Input id="email" type="email" placeholder="Enter your Email" />
              </Form.Item>
              <Form.Item
                label="Password"
                htmlFor="password"
                name="password"
                className="d-block"
                rules={[{ required: true, message: "Password is Required" }]}
              >
                <Input id="password" type="password" placeholder="Enter your Password" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  block
                  htmlFor="submit"
                  htmlType="submit"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          )}
          {step === "otp" && (
            <Form layout="vertical" onFinish={onSubmitOtp}>
              <Form.Item label="Email" className="d-block">
                <Input value={email} disabled />
              </Form.Item>
              <Form.Item
                label="OTP"
                htmlFor="otp"
                name="otp"
                className="d-block"
                rules={[{ required: true, message: "OTP is Required" }]}
              >
                <Input id="otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  block
                  htmlFor="submit"
                  htmlType="submit"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  Verify & Login
                </Button>
              </Form.Item>
              <Button type="link" onClick={() => setStep("credentials")}>Back</Button>
            </Form>
          )}
        </section>
        <section>
          <p>
            New User ? <Link to="/register">Register Here</Link>
          </p>
          <p>
            Forgot Password? <Link to="/forget">Click Here</Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Login;
