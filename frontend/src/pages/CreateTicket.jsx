import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../services/ticketService';
import ErrorBanner from '../components/ErrorBanner';

const CATEGORIES = ['NETWORK', 'SOFTWARE', 'HARDWARE', 'ACCOUNT', 'PAYMENT', 'OTHER'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function CreateTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'NETWORK', priority: 'MEDIUM' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setError(null);

    try {
      const created = await createTicket(form);
      navigate(`/tickets/${created.id}`);
    } catch (err) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setError(err);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Create Ticket</h1>
      <ErrorBanner error={error} onClose={() => setError(null)} />

      <form className="ticket-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
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

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
}
