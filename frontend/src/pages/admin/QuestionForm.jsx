import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { FiSave, FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { addQuestion, updateQuestion, getQuizQuestions } from '../../services/api';

const QuestionForm = () => {
  const { quizId, id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [questionText, setQuestionText] = useState('');
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState([
    { text: '', correct: false },
    { text: '', correct: false },
    { text: '', correct: false },
    { text: '', correct: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && quizId) {
      const fetchQuestion = async () => {
        try {
          setLoading(true);
          const response = await getQuizQuestions(quizId);
          const allQuestions = response.data;
          const question = allQuestions.find(
            (q) => String(q.id) === String(id)
          );

          if (question) {
            setQuestionText(question.questionText || question.text || '');
            setPoints(question.points || 1);
            if (question.options && question.options.length > 0) {
              setOptions(
                question.options.map((opt) => ({
                  text: opt.text || opt.optionText || '',
                  correct: opt.correct || opt.isCorrect || false,
                }))
              );
            }
          }
        } catch (error) {
          console.error('Failed to fetch question:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [id, quizId, isEdit]);

  const handleOptionChange = (index, value) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, text: value } : opt))
    );
  };

  const handleCorrectChange = (index) => {
    setOptions((prev) =>
      prev.map((opt, i) => ({
        ...opt,
        correct: i === index,
      }))
    );
  };

  const addOption = () => {
    if (options.length >= 6) {
      alert('Maximum 6 options allowed.');
      return;
    }
    setOptions((prev) => [...prev, { text: '', correct: false }]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      alert('Minimum 2 options required.');
      return;
    }
    const removed = options[index];
    const newOptions = options.filter((_, i) => i !== index);
    if (removed.correct && newOptions.length > 0) {
      newOptions[0].correct = true;
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert('Please enter the question text.');
      return;
    }

    const filledOptions = options.filter((opt) => opt.text.trim() !== '');
    if (filledOptions.length < 2) {
      alert('Please provide at least 2 options with text.');
      return;
    }

    const correctCount = filledOptions.filter((opt) => opt.correct).length;
    if (correctCount !== 1) {
      alert('Please mark exactly one option as correct.');
      return;
    }

    try {
      setSaving(true);
      const questionData = {
        questionText: questionText.trim(),
        points: Number(points),
        options: filledOptions.map((opt) => ({
          text: opt.text.trim(),
          correct: opt.correct,
        })),
      };

      if (isEdit) {
        await updateQuestion(id, questionData);
      } else {
        await addQuestion(quizId, questionData);
      }

      navigate(`/admin/quizzes/${quizId}/questions`);
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading question...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 720 }}>
      <Button
        variant="link"
        className="text-muted mb-3 p-0 text-decoration-none d-flex align-items-center gap-2"
        onClick={() => navigate(`/admin/quizzes/${quizId}/questions`)}
      >
        <FiArrowLeft size={18} />
        Back to Questions
      </Button>

      <h2 className="gradient-text fw-bold mb-4">
        {isEdit ? 'Edit Question' : 'Add New Question'}
      </h2>

      <div className="glass-card p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold" style={{ color: '#e0e0e0' }}>
              Question Text
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your question here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              className="bg-dark text-light border-secondary"
              style={{ padding: '0.75rem 1rem', resize: 'vertical' }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold" style={{ color: '#e0e0e0' }}>
              Points
            </Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={100}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="bg-dark text-light border-secondary"
              style={{ padding: '0.75rem 1rem', maxWidth: 150 }}
            />
          </Form.Group>

          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <Form.Label className="fw-semibold mb-0" style={{ color: '#e0e0e0' }}>
                Options
              </Form.Label>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addOption}
                disabled={options.length >= 6}
                className="d-flex align-items-center gap-1"
              >
                <FiPlus size={14} />
                Add Option
              </Button>
            </div>

            <div className="d-flex flex-column gap-3">
              {options.map((option, index) => (
                <div key={index}>
                  <InputGroup>
                    <InputGroup.Text
                      className="border-secondary"
                      style={{
                        background: option.correct
                          ? 'rgba(0, 201, 167, 0.2)'
                          : 'rgba(255,255,255,0.05)',
                        borderColor: option.correct
                          ? 'rgba(0, 201, 167, 0.4)'
                          : undefined,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => handleCorrectChange(index)}
                      title={option.correct ? 'Correct answer' : 'Mark as correct'}
                    >
                      <Form.Check
                        type="radio"
                        name="correctOption"
                        checked={option.correct}
                        onChange={() => handleCorrectChange(index)}
                        className="m-0"
                        style={{ cursor: 'pointer' }}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="bg-dark text-light border-secondary"
                      style={{
                        borderColor: option.correct
                          ? 'rgba(0, 201, 167, 0.4)'
                          : undefined,
                      }}
                    />
                    <Button
                      variant="outline-danger"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                      title="Remove option"
                    >
                      <FiTrash2 size={14} />
                    </Button>
                  </InputGroup>
                  {option.correct && (
                    <small style={{ color: '#00c9a7', marginTop: 4, display: 'block' }}>
                      ✓ Correct answer
                    </small>
                  )}
                </div>
              ))}
            </div>
          </div>

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
                  {isEdit ? 'Update Question' : 'Add Question'}
                </>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default QuestionForm;
