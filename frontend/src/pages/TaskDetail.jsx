import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { taskAPI } from '../services/api';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getById(id);
      setTask(response.data.task);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch task:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 404) {
        setError('タスクが見つかりません');
      } else {
        setError('タスクの取得に失敗しました');
      }
      setLoading(false);
    }
  };

  const handleCorrect = async () => {
    try {
      await taskAPI.complete(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete task:', error);
      setError('タスクの完了に失敗しました');
    }
  };

  const handleIncorrect = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.container}>読み込み中...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.error}>{error || 'タスクが見つかりません'}</div>
          <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
            ダッシュボードに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          {task.Question.Category && (
            <span style={styles.category}>{task.Question.Category.name}</span>
          )}

          <h2 style={styles.title}>問題</h2>
          <p style={styles.questionText}>{task.Question.question}</p>

          {!showAnswer ? (
            <button onClick={() => setShowAnswer(true)} style={styles.showAnswerButton}>
              回答を表示
            </button>
          ) : (
            <>
              <div style={styles.answerSection}>
                <h3 style={styles.subtitle}>回答</h3>
                <p style={styles.answerText}>{task.Question.answer}</p>

                {task.Question.explanation && (
                  <>
                    <h3 style={styles.subtitle}>解説</h3>
                    <p style={styles.explanationText}>{task.Question.explanation}</p>
                  </>
                )}
              </div>

              <div style={styles.buttonGroup}>
                <button onClick={handleIncorrect} style={styles.incorrectButton}>
                  ❌ 不正解（後でもう一度）
                </button>
                <button onClick={handleCorrect} style={styles.correctButton}>
                  ✅ 正解（完了する）
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  category: {
    display: 'inline-block',
    padding: '6px 16px',
    backgroundColor: '#e7f3ff',
    color: '#0066cc',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  questionText: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '24px',
    whiteSpace: 'pre-wrap',
  },
  showAnswerButton: {
    padding: '12px 32px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  answerSection: {
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: '2px solid #f0f0f0',
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  answerText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '24px',
    whiteSpace: 'pre-wrap',
  },
  explanationText: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#666',
    marginBottom: '24px',
    whiteSpace: 'pre-wrap',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '32px',
  },
  incorrectButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  correctButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default TaskDetail;
