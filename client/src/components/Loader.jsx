/**
 * Loader — skeleton loading placeholder component
 * Displays animated shimmer cards while products are loading
 * 
 * @param {number} count - Number of skeleton cards to show (default: 8)
 * @param {string} type - Type of skeleton: 'card', 'detail', 'table' (default: 'card')
 */
function Loader({ count = 8, type = 'card' }) {
  if (type === 'detail') {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="skeleton skeleton-image" style={{ height: '400px' }} />
          <div>
            <div className="skeleton skeleton-text" style={{ width: '40%', height: '0.75rem' }} />
            <div className="skeleton skeleton-title" style={{ width: '80%', marginTop: '1rem' }} />
            <div className="skeleton skeleton-title" style={{ width: '60%' }} />
            <div className="skeleton skeleton-text" style={{ width: '30%', marginTop: '1rem', height: '2rem' }} />
            <div className="skeleton skeleton-text" style={{ width: '100%', marginTop: '1.5rem' }} />
            <div className="skeleton skeleton-text" style={{ width: '100%' }} />
            <div className="skeleton skeleton-text" style={{ width: '70%' }} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <div className="skeleton" style={{ width: '150px', height: '48px' }} />
              <div className="skeleton" style={{ width: '150px', height: '48px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="table-wrapper">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div className="skeleton skeleton-text" style={{ width: '15%' }} />
            <div className="skeleton skeleton-text" style={{ width: '25%' }} />
            <div className="skeleton skeleton-text" style={{ width: '20%' }} />
            <div className="skeleton skeleton-text" style={{ width: '15%' }} />
            <div className="skeleton skeleton-text" style={{ width: '15%' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card card">
          <div className="skeleton skeleton-image" />
          <div style={{ padding: '1rem 1.5rem 1.5rem' }}>
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text-sm" />
            <div className="skeleton skeleton-text" style={{ width: '40%', marginTop: '0.75rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
              <div className="skeleton" style={{ width: '30%', height: '1.5rem' }} />
              <div className="skeleton" style={{ width: '40%', height: '2rem', borderRadius: 'var(--radius-lg)' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Loader;
