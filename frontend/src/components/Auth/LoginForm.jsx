import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import StandardLoginForm from "./Forms/StandardLoginForm";

const LoginForm = () => {
  const { login, loading, error } = useAuthStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form.email, form.password);
  };

  return (
    <>
      <StandardLoginForm
        form={form}
        loading={loading}
        error={error}
        showPassword={showPassword}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        togglePassword={() => setShowPassword(!showPassword)}
      />
    </>
  );
};

export default LoginForm;
