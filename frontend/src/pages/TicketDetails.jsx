import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getTicketById, updateTicket } from '../services/ticketService';
import { StatusBadge, PriorityBadge } from '../components/Badges';
import ErrorBanner from '../components/ErrorBanner';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const CATEGORIES = ['NETWORK', 'SOFTWARE', 'HARDWARE', 'ACCOUNT', 'PAYMENT', 'OTHER'];

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editing, setEditing] = useState(searchParams.get('edit') === 'true');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTicketById(id)
      .then((data) => {
        if (!mounted) return;
        setTicket(data);
        setForm({
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          status: data.status,
        });
      })
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    setError(null);

    try {
      const updated = await updateTicket(id, form);
      setTicket(updated);
      setEditing(false);
      setSuccessMsg('Ticket updated successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setError(err);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page"><p className="loading">Loading ticket…</p></div>;

  if (error && !ticket) {
    return (
      <div className="page">
        <ErrorBanner error={error} />
        <button className="btn btn-secondary" onClick={() => navigate('/tickets')}>Back to tickets</button>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="page">
      <h1>Ticket Details</h1>
      <ErrorBanner error={error} onClose={() => setError(null)} />
      {successMsg && <div className="success-banner">{successMsg}</div>}

      {!editing ? (
        <div className="ticket-detail-card">
          <div className="detail-row"><span>Ticket ID</span><span>{ticket.id}</span></div>
          <div className="detail-row"><span>Title</span><span>{ticket.title}</span></div>
          <div className="detail-row"><span>Description</span><span>{ticket.description}</span></div>
          <div className="detail-row"><span>Category</span><span>{ticket.category}</span></div>
          <div className="detail-row"><span>Priority</span><span><PriorityBadge priority={ticket.priority} /></span></div>
          <div className="detail-row"><span>Status</span><span><StatusBadge status={ticket.status} /></span></div>
          <div className="detail-row"><span>Created At</span><span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '-'}</span></div>
          <div className="detail-row"><span>Updated At</span><span>{ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : '-'}</span></div>

          <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Ticket</button>
        </div>
      ) : (
        <form className="ticket-form" onSubmit={handleSave}>
          <label>
            Title
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} />
            {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          </label>

          <label>
            Description
            <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
            {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
          </label>

          <label>
            Category
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label>
            Priority
            <select value={form.priority} onChange={(e) => update('priority', e.target.value)}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <label>
            Status
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </form>
      )}
    </div>
  );
}
