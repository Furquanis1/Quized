import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Spinner } from 'react-bootstrap';
import { FiTrophy } from 'react-icons/fi';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { getLeaderboard } from '../../services/api';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboard();
        setEntries(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy size={20} style={{ color: '#ffd700' }} />;
      case 1:
        return <FaMedal size={20} style={{ color: '#c0c0c0' }} />;
      case 2:
        return <FaMedal size={20} style={{ color: '#cd7f32' }} />;
      default:
        return <span className="fw-bold text-muted">{index + 1}</span>;
    }
  };

  const getRankClass = (index) => {
    switch (index) {
      case 0:
        return 'rank-gold';
      case 1:
        return 'rank-silver';
      case 2:
        return 'rank-bronze';
      default:
        return '';
    }
  };

  const getPercentage = (entry) => {
    if (entry.percentage !== undefined) return entry.percentage;
    if (entry.score !== undefined && entry.totalQuestions) {
      return Math.round((entry.score / entry.totalQuestions) * 100);
    }
    return 0;
  };

  const getPercentageBadge = (pct) => {
    if (pct >= 80) return 'success';
    if (pct >= 50) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading leaderboard...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <FiTrophy size={32} style={{ color: '#ffd700' }} />
        <h2 className="gradient-text mb-0 fw-bold">Leaderboard</h2>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-5 text-center">
          <FiTrophy size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No leaderboard data yet</h5>
          <p className="text-muted small">
            Entries will appear here once users complete quizzes.
          </p>
        </div>
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <Table responsive hover variant="dark" className="mb-0 align-middle">
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th className="px-4 py-3 text-center" style={{ width: 80 }}>
                  Rank
                </th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Quiz</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => {
                const pct = getPercentage(entry);
                const rankClass = getRankClass(index);

                return (
                  <tr
                    key={entry.id || index}
                    className={rankClass}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background:
                        index === 0
                          ? 'rgba(255, 215, 0, 0.06)'
                          : index === 1
                          ? 'rgba(192, 192, 192, 0.05)'
                          : index === 2
                          ? 'rgba(205, 127, 50, 0.05)'
                          : 'transparent',
                      transition: 'background 0.2s ease',
                    }}
                  >
                    <td className="px-4 py-3 text-center">{getRankIcon(index)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="fw-semibold"
                        style={{
                          color:
                            index === 0
                              ? '#ffd700'
                              : index === 1
                              ? '#c0c0c0'
                              : index === 2
                              ? '#cd7f32'
                              : '#e0e0e0',
                        }}
                      >
                        {entry.username || entry.user?.username || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.quizTitle || entry.quiz?.title || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-center fw-semibold">
                      {entry.score !== undefined ? entry.score : '—'}/
                      {entry.totalQuestions || entry.total || '—'}
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
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      <style>{`
        .rank-gold td {
          border-left: 3px solid #ffd700 !important;
        }
        .rank-silver td {
          border-left: 3px solid #c0c0c0 !important;
        }
        .rank-bronze td {
          border-left: 3px solid #cd7f32 !important;
        }
        .rank-gold td:first-child,
        .rank-silver td:first-child,
        .rank-bronze td:first-child {
          border-left: 3px solid;
        }
        .rank-gold td:not(:first-child),
        .rank-silver td:not(:first-child),
        .rank-bronze td:not(:first-child) {
          border-left: none !important;
        }
      `}</style>
    </Container>
  );
};

export default Leaderboard;
