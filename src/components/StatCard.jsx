export default function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className="stat-content">
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
}
