export default function ErrorBanner({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="error-banner">
      <div>
        <strong>Something went wrong.</strong>
        <p>{error.message}</p>
        {error.correlationId && (
          <p className="error-correlation">Reference ID: {error.correlationId}</p>
        )}
      </div>
      {onClose && (
        <button className="error-close" onClick={onClose}>×</button>
      )}
    </div>
  );
}
