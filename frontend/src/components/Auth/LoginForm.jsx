import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import StandardLoginForm from "./Forms/StandardLoginForm";

const LoginForm = () => {
  const { login, loading, error } = useAuthStore();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
    assignedBrgy: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: value,
      // Clear assignedBrgy when role changes to MLGOO_STAFF
      ...(name === "role" && value === "MLGOO_STAFF" ? { assignedBrgy: "" } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
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
