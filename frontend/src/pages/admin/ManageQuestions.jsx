import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Button, Badge, Modal, Spinner } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { getAdminQuiz, getQuizQuestions, deleteQuestion } from '../../services/api';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizRes, questionsRes] = await Promise.all([
        getAdminQuiz(quizId),
        getQuizQuestions(quizId),
      ]);
      setQuiz(quizRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      console.error('Failed to fetch quiz questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;
    try {
      await deleteQuestion(questionToDelete.id);
      setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete.id));
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading questions...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Link
        to="/admin/quizzes"
        className="text-muted mb-3 d-inline-flex align-items-center gap-2 text-decoration-none"
      >
        <FiArrowLeft size={18} />
        Back to Quizzes
      </Link>

      <div className="d-flex align-items-center justify-content-between mb-4 mt-3">
        <h2 className="gradient-text mb-0 fw-bold">
          Questions for: {quiz?.title || 'Quiz'}
        </h2>
        <Link to={`/admin/quizzes/${quizId}/questions/new`}>
          <Button className="btn-gradient d-flex align-items-center gap-2">
            <FiPlus size={18} />
            Add Question
          </Button>
        </Link>
      </div>

      {questions.length === 0 ? (
        <div className="glass-card p-5 text-center">
          <FiCheckCircle size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No questions yet</h5>
          <p className="text-muted">Add your first question to this quiz.</p>
          <Link to={`/admin/quizzes/${quizId}/questions/new`}>
            <Button className="btn-gradient">
              <FiPlus size={18} className="me-2" />
              Add Question
            </Button>
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {questions.map((question, index) => (
            <div key={question.id} className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-start gap-3 flex-grow-1">
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0"
                    style={{
                      width: 36,
                      height: 36,
                      background: 'rgba(108, 99, 255, 0.2)',
                      color: '#6c63ff',
                      fontSize: '0.85rem',
                    }}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-2" style={{ color: '#e0e0e0' }}>
                      {question.questionText || question.text}
                    </h6>
                    <Badge
                      bg="info"
                      className="px-2 py-1"
                      style={{ fontSize: '0.7rem' }}
                    >
                      {question.points || 1} {(question.points || 1) === 1 ? 'point' : 'points'}
                    </Badge>
                  </div>
                </div>
                <div className="d-flex gap-2 flex-shrink-0">
                  <Link to={`/admin/quizzes/${quizId}/questions/edit/${question.id}`}>
                    <Button variant="outline-primary" size="sm" title="Edit Question">
                      <FiEdit size={14} />
                    </Button>
                  </Link>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    title="Delete Question"
                    onClick={() => handleDeleteClick(question)}
                  >
                    <FiTrash2 size={14} />
                  </Button>
                </div>
              </div>

              <div className="ms-5 ps-2">
                <div className="d-flex flex-column gap-2">
                  {(question.options || []).map((option, optIdx) => {
                    const isCorrect = option.correct || option.isCorrect;
                    return (
                      <div
                        key={optIdx}
                        className="d-flex align-items-center gap-2 px-3 py-2 rounded"
                        style={{
                          background: isCorrect
                            ? 'rgba(0, 201, 167, 0.15)'
                            : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isCorrect ? 'rgba(0, 201, 167, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        {isCorrect && (
                          <FiCheckCircle size={16} style={{ color: '#00c9a7', flexShrink: 0 }} />
                        )}
                        <span
                          className="small"
                          style={{
                            color: isCorrect ? '#00c9a7' : '#b0b0b0',
                            fontWeight: isCorrect ? 600 : 400,
                          }}
                        >
                          {option.text || option.optionText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Modal.Title className="fw-bold">Delete Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete this question? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button variant="outline-secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <FiTrash2 size={14} className="me-2" />
            Delete Question
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageQuestions;
