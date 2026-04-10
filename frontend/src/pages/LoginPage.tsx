import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAppDispatch } from "../app/hooks";
import { setAuth } from "../features/auth/authSlice";
import { loginRequest } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  type LoginForm = typeof form;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof LoginForm]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginRequest(form);
      const { token, ...user } = result.data;
      dispatch(setAuth({ token, user }));
      navigate("/home");
    } catch (err) {
      const errorMessage =
        (err as AxiosError<{ message?: string }>).response?.data?.message ||
        "Login gagal.";
      setError(errorMessage);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1 className="brand">circle</h1>
        <h2 className="auth-subtitle">Login to Circle</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="identifier"
            placeholder="Email/Username"
            value={form.identifier}
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
            Login
          </button>
        </form>
        <Link className="auth-link" to="/register">
          Don&apos;t have an account yet? Create account
        </Link>
      </section>
    </main>
  );
}

export default LoginPage;
