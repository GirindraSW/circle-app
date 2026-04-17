import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAppDispatch } from "../app/hooks";
import BrandMark from "../components/BrandMark";
import { setAuth } from "../features/auth/authSlice";
import { registerRequest } from "../services/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  type RegisterForm = typeof form;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof RegisterForm]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const result = await registerRequest(form);
      const { token, ...user } = result.data;
      dispatch(setAuth({ token, user }));
      navigate("/home");
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message?: string }>).response?.data?.message ||
        "Register gagal.";
      setError(errorMessage);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <BrandMark variant="stacked" showTagline />
        <section className="auth-card">
          <h2 className="auth-subtitle">Create your Circle account</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="auth-input"
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {error ? <p className="auth-error">{error}</p> : null}
            <button className="auth-btn" type="submit">
              Create
            </button>
          </form>
          <Link className="auth-link" to="/login">
            Already have account? Login
          </Link>
        </section>
      </section>
    </main>
  );
}

export default RegisterPage;
