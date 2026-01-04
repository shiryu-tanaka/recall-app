import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, taskAPI } from '../services/api';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userResponse, todayResponse, weeklyResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        taskAPI.getToday(),
        taskAPI.getWeekly(),
      ]);

      setUser(userResponse.data.user);
      setTodayTasks(todayResponse.data.tasks);
      setWeeklyTasks(weeklyResponse.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.container}>読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.welcome}>ようこそ、{user.username}さん！</h2>

        {/* 今日のタスク */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>📅 今日のタスク ({todayTasks.length})</h3>
          {todayTasks.length === 0 ? (
            <div style={styles.emptyCard}>
              <p>今日のタスクはありません</p>
            </div>
          ) : (
            <div style={styles.taskList}>
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  style={styles.taskCard}
                  onClick={() => handleTaskClick(task.id)}
                >
                  {task.Question.Category && (
                    <span style={styles.category}>
                      {task.Question.Category.name}
                    </span>
                  )}
                  <p style={styles.questionText}>{task.Question.question}</p>
                  <p style={styles.dueDate}>
                    期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 週間のタスク */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>📆 週間のタスク ({weeklyTasks.length})</h3>
          {weeklyTasks.length === 0 ? (
            <div style={styles.emptyCard}>
              <p>今週のタスクはありません</p>
            </div>
          ) : (
            <div style={styles.taskList}>
              {weeklyTasks.map((task) => (
                <div
                  key={task.id}
                  style={styles.taskCard}
                  onClick={() => handleTaskClick(task.id)}
                >
                  {task.Question.Category && (
                    <span style={styles.category}>
                      {task.Question.Category.name}
                    </span>
                  )}
                  <p style={styles.questionText}>{task.Question.question}</p>
                  <p style={styles.dueDate}>
                    期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  content: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcome: {
    fontSize: '28px',
    marginBottom: '32px',
    color: '#333',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
  taskList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  taskCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  category: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#e7f3ff',
    color: '#0066cc',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '12px',
  },
  questionText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '8px',
  },
  dueDate: {
    fontSize: '12px',
    color: '#666',
  },
  emptyCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    color: '#999',
  },
  container: {
    padding: '40px 20px',
    textAlign: 'center',
  },
};

export default Dashboard;
