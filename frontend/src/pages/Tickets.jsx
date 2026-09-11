import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTickets, deleteTicket } from '../services/ticketService';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import ErrorBanner from '../components/ErrorBanner';
import ConfirmModal from '../components/ConfirmModal';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const CATEGORIES = ['NETWORK', 'SOFTWARE', 'HARDWARE', 'ACCOUNT', 'PAYMENT', 'OTHER'];

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', category: '', search: '' });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  function load() {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    getTickets(params)
      .then(setTickets)
      .catch(setError)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function handleDelete() {
    try {
      await deleteTicket(pendingDeleteId);
      setPendingDeleteId(null);
      load();
    } catch (err) {
      setError(err);
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="page">
      <h1>Tickets</h1>
      <ErrorBanner error={error} onClose={() => setError(null)} />

      <div className="filters">
        <input
          type="text"
          placeholder="Search tickets…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading tickets…</p>
      ) : tickets.length === 0 ? (
        <p className="empty-state">No tickets found.</p>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.category}</td>
                <td><PriorityBadge priority={t.priority} /></td>
                <td><StatusBadge status={t.status} /></td>
                <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}</td>
                <td className="actions">
                  <Link to={`/tickets/${t.id}`}>View</Link>
                  <Link to={`/tickets/${t.id}?edit=true`}>Edit</Link>
                  <button className="link-danger" onClick={() => setPendingDeleteId(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmModal
        open={!!pendingDeleteId}
        title="Delete ticket"
        message="This action cannot be undone. Are you sure you want to delete this ticket?"
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
