import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { categoryAPI } from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCategoryName.trim()) {
      setError("カテゴリ名を入力してください");
      return;
    }

    try {
      await categoryAPI.create({ name: newCategoryName });
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.message || "カテゴリの作成に失敗しました");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleUpdate = async (id) => {
    setError("");

    if (!editingName.trim()) {
      setError("カテゴリ名を入力してください");
      return;
    }

    try {
      await categoryAPI.update(id, { name: editingName });
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.message || "カテゴリの更新に失敗しました");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("このカテゴリを削除しますか？")) {
      return;
    }

    try {
      await categoryAPI.delete(id);
      fetchCategories();
    } catch (error) {
      setError(error.response?.data?.message || "カテゴリの削除に失敗しました");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName("");
    setError("");
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.container}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>カテゴリ管理</h1>

        {/* 新規作成フォーム */}
        <div style={styles.createSection}>
          <h2 style={styles.subtitle}>新しいカテゴリを作成</h2>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleCreate} style={styles.form}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="カテゴリ名を入力"
              style={styles.input}
            />
            <button type="submit" style={styles.createButton}>
              作成
            </button>
          </form>
        </div>

        {/* カテゴリ一覧 */}
        <div style={styles.listSection}>
          <h2 style={styles.subtitle}>カテゴリ一覧</h2>
          {categories.length === 0 ? (
            <p style={styles.emptyMessage}>カテゴリがまだありません</p>
          ) : (
            <div style={styles.list}>
              {categories.map((category) => (
                <div key={category.id} style={styles.item}>
                  {editingId === category.id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        style={styles.editInput}
                      />
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => handleUpdate(category.id)}
                          style={styles.saveButton}
                        >
                          保存
                        </button>
                        <button
                          onClick={handleCancel}
                          style={styles.cancelButton}
                        >
                          キャンセル
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span style={styles.categoryName}>{category.name}</span>
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => handleEdit(category)}
                          style={styles.editButton}
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          style={styles.deleteButton}
                        >
                          削除
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "32px",
    color: "#333",
  },
  subtitle: {
    fontSize: "20px",
    marginBottom: "16px",
    color: "#333",
  },
  createSection: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "32px",
  },
  form: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
  },
  createButton: {
    padding: "10px 24px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  error: {
    padding: "12px",
    backgroundColor: "#fee",
    color: "#c33",
    borderRadius: "4px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  listSection: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
  },
  categoryName: {
    fontSize: "16px",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    padding: "6px 12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  editInput: {
    flex: 1,
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    outline: "none",
    marginRight: "12px",
  },
  saveButton: {
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  cancelButton: {
    padding: "6px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
    padding: "20px",
  },
};

export default Categories;
