import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { questionAPI } from '../services/api';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await questionAPI.getAll();
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setError('問題の取得に失敗しました');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('この問題を削除しますか？関連するタスクも削除されます。')) {
      return;
    }

    try {
      await questionAPI.delete(id);
      fetchQuestions();
    } catch (error) {
      setError(error.response?.data?.message || '問題の削除に失敗しました');
    }
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
        <div style={styles.header}>
          <h1 style={styles.title}>問題一覧</h1>
          <button
            onClick={() => navigate('/questions/new')}
            style={styles.createButton}
          >
            + 新しい問題を作成
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {questions.length === 0 ? (
          <div style={styles.empty}>
            <p>まだ問題がありません</p>
            <button
              onClick={() => navigate('/questions/new')}
              style={styles.createButtonLarge}
            >
              最初の問題を作成する
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {questions.map((question) => (
              <div key={question.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  {question.Category && (
                    <span style={styles.category}>{question.Category.name}</span>
                  )}
                </div>
                <h3 style={styles.questionText}>{question.question}</h3>
                <p style={styles.answerLabel}>回答:</p>
                <p style={styles.answerText}>{question.answer}</p>
                {question.explanation && (
                  <>
                    <p style={styles.explanationLabel}>解説:</p>
                    <p style={styles.explanationText}>{question.explanation}</p>
                  </>
                )}
                <div style={styles.cardFooter}>
                  <button
                    onClick={() => navigate(`/questions/edit/${question.id}`)}
                    style={styles.editButton}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    style={styles.deleteButton}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    color: '#333',
  },
  createButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  createButtonLarge: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '16px',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  empty: {
    backgroundColor: 'white',
    padding: '60px 40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    marginBottom: '12px',
  },
  category: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#e7f3ff',
    color: '#0066cc',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  questionText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  answerLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#666',
    marginBottom: '4px',
  },
  answerText: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '12px',
  },
  explanationLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#666',
    marginBottom: '4px',
  },
  explanationText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  cardFooter: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '12px',
  },
  editButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Questions;
