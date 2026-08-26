export default function SummaryCard({
  title,
  amount,
  icon: Icon,
  description,
  variant,
}) {
  return (
    <div className={`summary-card ${variant}`}>
      <div className="summary-card-top">
        <div className="summary-icon">
          <Icon size={22} />
        </div>

        <span>{description}</span>
      </div>

      <div className="summary-card-content">
        <p>{title}</p>
        <h2>{amount}</h2>
      </div>
    </div>
  );
}