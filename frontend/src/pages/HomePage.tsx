import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

function HomePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main className="home-page">
      <section className="home-card">
        <h1 className="brand">circle</h1>
        <h2>Home</h2>
        <p>
          Hai, <strong>{user?.name || user?.username || "User"}</strong>
        </p>
        <p>Template auth + redux sudah aktif.</p>
        <button className="auth-btn" onClick={handleLogout} type="button">
          Logout
        </button>
      </section>
    </main>
  );
}

export default HomePage;
