interface ScoreBadgeProps {
  score: number;
}

function ScoreBadge({ score }: ScoreBadgeProps) {
  let badgeColor = "";
  let badgeText = "";

  if (score > 70) {
    badgeColor = "bg-badge-green text-green-600";
    badgeText = "strong";
  } else if (score > 49) {
    badgeColor = "bg-badge-yellow text-yellow-600";
    badgeText = "Good Start";
  } else {
    badgeColor = "bg-badge-red text-red-600";
    badgeText = "Needs W0rk";
  }
  return (
    <div className={`px-3 py-1 rouded-full ${badgeColor}`}>
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  );
}

export default ScoreBadge;
