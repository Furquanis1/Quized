import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { FiBook, FiHelpCircle, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { getAdminQuizzes, getAllAttempts } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    quizzes: 0,
    questions: 0,
    attempts: 0,
    avgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [quizzesRes, attemptsRes] = await Promise.all([
          getAdminQuizzes(),
          getAllAttempts(),
        ]);

        const quizzes = quizzesRes.data;
        const attempts = attemptsRes.data;

        const totalQuestions = quizzes.reduce(
          (sum, quiz) => sum + (quiz.questionCount || quiz.questions?.length || 0),
          0
        );

        const avgScore =
          attempts.length > 0
            ? Math.round(
                attempts.reduce((sum, a) => sum + (a.percentage || (a.score / a.totalQuestions) * 100 || 0), 0) /
                  attempts.length
              )
            : 0;

        setStats({
          quizzes: quizzes.length,
          questions: totalQuestions,
          attempts: attempts.length,
          avgScore,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      icon: <FiBook size={28} />,
      label: 'Total Quizzes',
      value: stats.quizzes,
      color: '#6c63ff',
      delay: '0s',
    },
    {
      icon: <FiHelpCircle size={28} />,
      label: 'Total Questions',
      value: stats.questions,
      color: '#00c9a7',
      delay: '0.1s',
    },
    {
      icon: <FiUsers size={28} />,
      label: 'Total Attempts',
      value: stats.attempts,
      color: '#ff6b6b',
      delay: '0.2s',
    },
    {
      icon: <FiTrendingUp size={28} />,
      label: 'Avg. Score',
      value: `${stats.avgScore}%`,
      color: '#ffa94d',
      delay: '0.3s',
    },
  ];

  const quickLinks = [
    {
      title: 'Manage Quizzes',
      description: 'Create, edit, and delete quizzes',
      to: '/admin/quizzes',
      icon: <FiBook size={24} />,
      color: '#6c63ff',
    },
    {
      title: 'View Attempts',
      description: 'Review all quiz attempts and scores',
      to: '/admin/attempts',
      icon: <FiUsers size={24} />,
      color: '#00c9a7',
    },
    {
      title: 'Leaderboard',
      description: 'See top performers across all quizzes',
      to: '/admin/leaderboard',
      icon: <FiTrendingUp size={24} />,
      color: '#ffa94d',
    },
  ];

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center mb-4">
        <h2 className="gradient-text mb-0 fw-bold">Admin Dashboard</h2>
        <Badge bg="primary" className="ms-3 px-3 py-2" style={{ fontSize: '0.8rem' }}>
          {user?.username || 'Admin'}
        </Badge>
      </div>

      <Row className="g-4 mb-5">
        {statCards.map((card, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <div
              className="glass-card p-4 h-100 text-center"
              style={{
                animation: `fadeInUp 0.5s ease forwards`,
                animationDelay: card.delay,
                opacity: 0,
              }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: 56,
                  height: 56,
                  background: `${card.color}20`,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
              <h3 className="fw-bold mb-1" style={{ color: card.color, fontSize: '2rem' }}>
                {card.value}
              </h3>
              <p className="text-muted mb-0 small">{card.label}</p>
            </div>
          </Col>
        ))}
      </Row>

      <h4 className="fw-bold mb-3" style={{ color: '#e0e0e0' }}>
        Quick Actions
      </h4>
      <Row className="g-4">
        {quickLinks.map((link, index) => (
          <Col key={index} xs={12} md={4}>
            <Link to={link.to} className="text-decoration-none">
              <div
                className="glass-card p-4 h-100"
                style={{
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 32px ${link.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: 48,
                        height: 48,
                        background: `${link.color}20`,
                        color: link.color,
                      }}
                    >
                      {link.icon}
                    </div>
                    <h5 className="fw-bold mb-1" style={{ color: '#e0e0e0' }}>
                      {link.title}
                    </h5>
                    <p className="text-muted mb-0 small">{link.description}</p>
                  </div>
                  <FiArrowRight size={20} style={{ color: link.color }} />
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Container>
  );
};

export default AdminDashboard;
