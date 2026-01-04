import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { questionAPI, categoryAPI } from '../services/api';

function QuestionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    explanation: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchQuestion();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await questionAPI.getById(id);
      const question = response.data.question;
      setFormData({
        question: question.question,
        answer: question.answer,
        explanation: question.explanation || '',
        categoryId: question.categoryId || '',
      });
    } catch (error) {
      console.error('Failed to fetch question:', error);
      setError('問題の取得に失敗しました');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('問題と回答は必須です');
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await questionAPI.update(id, formData);
      } else {
        await questionAPI.create(formData);
      }
      navigate('/questions');
    } catch (error) {
      setError(error.response?.data?.message || '問題の保存に失敗しました');
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>
          {isEditMode ? '問題を編集' : '新しい問題を作成'}
        </h1>

        <div style={styles.formCard}>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>問題 *</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                style={styles.textarea}
                rows="4"
                placeholder="問題を入力してください"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>回答 *</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                style={styles.textarea}
                rows="4"
                placeholder="回答を入力してください"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>解説</label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                style={styles.textarea}
                rows="4"
                placeholder="解説を入力してください（任意）"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>カテゴリ</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">カテゴリを選択（任意）</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate('/questions')}
                style={styles.cancelButton}
              >
                キャンセル
              </button>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? '保存中...' : isEditMode ? '更新' : '作成'}
              </button>
            </div>
          </form>
        </div>

        {!isEditMode && (
          <div style={styles.info}>
            <p>
              ℹ️ 問題を作成すると、自動的に以下のスケジュールでタスクが登録されます：
            </p>
            <ul style={styles.list}>
              <li>1日後</li>
              <li>3日後</li>
              <li>1週間後</li>
              <li>2週間後</li>
              <li>1ヶ月後</li>
            </ul>
          </div>
        )}
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
  title: {
    fontSize: '28px',
    marginBottom: '32px',
    color: '#333',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#555',
  },
  textarea: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  select: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    outline: 'none',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
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
  info: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#e7f3ff',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#004085',
  },
  list: {
    marginTop: '8px',
    marginLeft: '20px',
  },
};

export default QuestionForm;
