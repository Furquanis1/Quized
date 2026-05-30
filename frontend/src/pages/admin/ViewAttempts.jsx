import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner, Form } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { getAllAttempts } from '../../services/api';

const ViewAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [filteredAttempts, setFilteredAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const response = await getAllAttempts();
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.attemptDate || b.createdAt) - new Date(a.attemptDate || a.createdAt)
        );
        setAttempts(sorted);
        setFilteredAttempts(sorted);
      } catch (error) {
        console.error('Failed to fetch attempts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAttempts(attempts);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = attempts.filter(
      (attempt) =>
        (attempt.username || attempt.user?.username || '').toLowerCase().includes(term) ||
        (attempt.quizTitle || attempt.quiz?.title || '').toLowerCase().includes(term)
    );
    setFilteredAttempts(filtered);
  }, [searchTerm, attempts]);

  const getPercentage = (attempt) => {
    if (attempt.percentage !== undefined) return attempt.percentage;
    if (attempt.score !== undefined && attempt.totalQuestions) {
      return Math.round((attempt.score / attempt.totalQuestions) * 100);
    }
    return 0;
  };

  const getPercentageBadge = (pct) => {
    if (pct >= 80) return 'success';
    if (pct >= 50) return 'warning';
    return 'danger';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading attempts...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="gradient-text fw-bold mb-4">All Quiz Attempts</h2>

      <div className="glass-card p-3 mb-4">
        <div className="position-relative">
          <FiSearch
            size={18}
            className="position-absolute"
            style={{
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
              pointerEvents: 'none',
            }}
          />
          <Form.Control
            type="text"
            placeholder="Search by username or quiz title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark text-light border-secondary"
            style={{ paddingLeft: 42, padding: '0.75rem 1rem 0.75rem 42px' }}
          />
        </div>
      </div>

      {filteredAttempts.length === 0 ? (
        <div className="glass-card p-5 text-center">
          <FiSearch size={48} className="text-muted mb-3" />
          <h5 className="text-muted">
            {searchTerm ? 'No matching attempts found' : 'No attempts yet'}
          </h5>
          <p className="text-muted small">
            {searchTerm
              ? 'Try a different search term.'
              : 'Attempts will appear here once users take quizzes.'}
          </p>
        </div>
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <Table responsive hover variant="dark" className="mb-0 align-middle">
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Quiz</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Percentage</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttempts.map((attempt, index) => {
                const pct = getPercentage(attempt);
                return (
                  <tr key={attempt.id || index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="px-4 py-3 text-muted">{index + 1}</td>
                    <td className="px-4 py-3 fw-semibold">
                      {attempt.username || attempt.user?.username || 'Unknown'}
                    </td>
                    <td className="px-4 py-3">
                      {attempt.quizTitle || attempt.quiz?.title || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {attempt.score !== undefined ? attempt.score : '—'}/
                      {attempt.totalQuestions || attempt.total || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        bg={getPercentageBadge(pct)}
                        className="px-3 py-2"
                        style={{ fontSize: '0.75rem', minWidth: 55 }}
                      >
                        {pct}%
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted small">
                      {formatDate(attempt.attemptDate || attempt.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      <div className="text-muted small mt-3 text-end">
        Showing {filteredAttempts.length} of {attempts.length} attempts
      </div>
    </Container>
  );
};

export default ViewAttempts;
