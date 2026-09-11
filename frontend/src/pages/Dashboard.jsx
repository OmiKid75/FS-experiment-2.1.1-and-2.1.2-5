import { useEffect, useState } from 'react';
import { getTicketStats } from '../services/ticketService';
import ErrorBanner from '../components/ErrorBanner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTicketStats()
      .then((data) => mounted && setStats(data))
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const cards = [
    { label: 'Total Tickets', value: stats?.total, key: 'total' },
    { label: 'Open', value: stats?.open, key: 'open' },
    { label: 'In Progress', value: stats?.inProgress, key: 'inProgress' },
    { label: 'Resolved', value: stats?.resolved, key: 'resolved' },
    { label: 'Closed', value: stats?.closed, key: 'closed' },
    { label: 'Critical', value: stats?.critical, key: 'critical' },
  ];

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <ErrorBanner error={error} onClose={() => setError(null)} />

      {loading ? (
        <p className="loading">Loading statistics…</p>
      ) : (
        <div className="stats-grid">
          {cards.map((c) => (
            <div className={`stat-card stat-${c.key}`} key={c.key}>
              <span className="stat-value">{c.value ?? 0}</span>
              <span className="stat-label">{c.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
