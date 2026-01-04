import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.logo}>
          Recall App
        </Link>
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>
            ダッシュボード
          </Link>
          <Link to="/categories" style={styles.link}>
            カテゴリ
          </Link>
          <button onClick={handleLogout} style={styles.logoutButton}>
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#007bff",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "#333",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Navbar;
