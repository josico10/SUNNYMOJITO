export default function StatusPill({ status }) {
  return (
    <span className={`pill pill--${status}`}>
      <i className="dot" /> {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );
}
