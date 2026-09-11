import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Normalizes axios errors into a consistent shape the UI can rely on.
function toFriendlyError(error) {
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || defaultMessageForStatus(status),
      errors: data?.errors || null,
      correlationId: data?.correlationId || null,
    };
  }
  return {
    status: null,
    message: 'Unable to reach the server. Please check your connection.',
    errors: null,
    correlationId: null,
  };
}

function defaultMessageForStatus(status) {
  switch (status) {
    case 400:
      return 'Invalid request';
    case 404:
      return 'Ticket not found';
    case 500:
      return 'Server error, please try again later';
    default:
      return 'Something went wrong';
  }
}

export async function getTickets(params = {}) {
  try {
    const res = await client.get('/tickets', { params });
    return res.data.data;
  } catch (err) {
    throw toFriendlyError(err);
  }
}

export async function getTicketStats() {
  try {
    const res = await client.get('/tickets/stats');
    return res.data.data;
  } catch (err) {
    throw toFriendlyError(err);
  }
}

export async function getTicketById(id) {
  try {
    const res = await client.get(`/tickets/${id}`);
    return res.data.data;
  } catch (err) {
    throw toFriendlyError(err);
  }
}

export async function createTicket(data) {
  try {
    const res = await client.post('/tickets', data);
    return res.data.data;
  } catch (err) {
    throw toFriendlyError(err);
  }
}

export async function updateTicket(id, data) {
  try {
    const res = await client.put(`/tickets/${id}`, data);
    return res.data.data;
  } catch (err) {
    throw toFriendlyError(err);
  }
}

export async function deleteTicket(id) {
  try {
    const res = await client.delete(`/tickets/${id}`);
    return res.data.data;
  } catch (err) {
    throw toFriendlyError(err);
  }
}
