import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Badge, Modal, Spinner } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiList } from 'react-icons/fi';
import { getAdminQuizzes, deleteQuiz } from '../../services/api';

const ManageQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await getAdminQuizzes();
      setQuizzes(response.data);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteClick = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;
    try {
      await deleteQuiz(quizToDelete.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete.id));
      setShowDeleteModal(false);
      setQuizToDelete(null);
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setQuizToDelete(null);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading quizzes...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="gradient-text mb-0 fw-bold">Manage Quizzes</h2>
        <Link to="/admin/quizzes/new">
          <Button className="btn-gradient d-flex align-items-center gap-2">
            <FiPlus size={18} />
            Create New Quiz
          </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="glass-card p-5 text-center">
          <FiList size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No quizzes found</h5>
          <p className="text-muted">Get started by creating your first quiz.</p>
          <Link to="/admin/quizzes/new">
            <Button className="btn-gradient">
              <FiPlus size={18} className="me-2" />
              Create Quiz
            </Button>
          </Link>
        </div>
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <Table responsive hover variant="dark" className="mb-0 align-middle">
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 text-center">Questions</th>
                <th className="px-4 py-3 text-center">Time (min)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-4 py-3 fw-semibold">{quiz.title}</td>
                  <td className="px-4 py-3 text-center">
                    {quiz.questionCount || quiz.questions?.length || 0}
                  </td>
                  <td className="px-4 py-3 text-center">{quiz.timeLimit || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      bg={quiz.active ? 'success' : 'secondary'}
                      className="px-3 py-2"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {quiz.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        title="Edit Quiz"
                        onClick={() => navigate(`/admin/quizzes/edit/${quiz.id}`)}
                      >
                        <FiEdit size={14} />
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        title="Manage Questions"
                        onClick={() => navigate(`/admin/quizzes/${quiz.id}/questions`)}
                      >
                        <FiList size={14} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        title="Delete Quiz"
                        onClick={() => handleDeleteClick(quiz)}
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered contentClassName="bg-dark text-light border-secondary">
        <Modal.Header closeButton closeVariant="white" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Modal.Title className="fw-bold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete the quiz{' '}
            <strong style={{ color: '#ff6b6b' }}>"{quizToDelete?.title}"</strong>?
            This action cannot be undone and will also delete all associated questions.
          </p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button variant="outline-secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <FiTrash2 size={14} className="me-2" />
            Delete Quiz
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageQuizzes;
