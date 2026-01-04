import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.welcome}>ようこそ、{user.username}さん！</h2>
        <p style={styles.text}>メールアドレス: {user.email}</p>
        <div style={styles.placeholder}>
          <p>ここに今日のタスクや週間タスクが表示されます（今後実装）</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  welcome: {
    fontSize: "28px",
    marginBottom: "16px",
    color: "#333",
  },
  text: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "32px",
  },
  placeholder: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    color: "#999",
  },
};

export default Dashboard;
