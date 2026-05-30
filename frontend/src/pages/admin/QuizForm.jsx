import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { getAdminQuiz, createQuiz, updateQuiz } from '../../services/api';

const QuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchQuiz = async () => {
        try {
          setLoading(true);
          const response = await getAdminQuiz(id);
          const quiz = response.data;
          setTitle(quiz.title || '');
          setDescription(quiz.description || '');
          setTimeLimit(quiz.timeLimit || 30);
          setActive(quiz.active !== undefined ? quiz.active : true);
        } catch (error) {
          console.error('Failed to fetch quiz:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a quiz title.');
      return;
    }

    if (timeLimit < 1 || timeLimit > 300) {
      alert('Time limit must be between 1 and 300 minutes.');
      return;
    }

    try {
      setSaving(true);
      const quizData = {
        title: title.trim(),
        description: description.trim(),
        timeLimit: Number(timeLimit),
        active,
      };

      if (isEdit) {
        await updateQuiz(id, quizData);
      } else {
        await createQuiz(quizData);
      }

      navigate('/admin/quizzes');
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading quiz...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 720 }}>
      <Button
        variant="link"
        className="text-muted mb-3 p-0 text-decoration-none d-flex align-items-center gap-2"
        onClick={() => navigate('/admin/quizzes')}
      >
        <FiArrowLeft size={18} />
        Back to Quizzes
      </Button>

      <h2 className="gradient-text fw-bold mb-4">
        {isEdit ? 'Edit Quiz' : 'Create New Quiz'}
      </h2>

      <div className="glass-card p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold" style={{ color: '#e0e0e0' }}>
              Quiz Title
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-dark text-light border-secondary"
              style={{ padding: '0.75rem 1rem' }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold" style={{ color: '#e0e0e0' }}>
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter quiz description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-dark text-light border-secondary"
              style={{ padding: '0.75rem 1rem', resize: 'vertical' }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold" style={{ color: '#e0e0e0' }}>
              Time Limit (minutes)
            </Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={300}
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="bg-dark text-light border-secondary"
              style={{ padding: '0.75rem 1rem', maxWidth: 200 }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <div className="d-flex align-items-center gap-3">
              <Form.Label className="fw-semibold mb-0" style={{ color: '#e0e0e0' }}>
                Active
              </Form.Label>
              <Form.Check
                type="switch"
                id="quiz-active-switch"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                label={active ? 'Enabled' : 'Disabled'}
                className="text-muted"
              />
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              className="btn-gradient d-flex align-items-center gap-2 px-4 py-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  {isEdit ? 'Update Quiz' : 'Create Quiz'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default QuizForm;
