const TYPE_WEIGHTS = { Placement: 3, Result: 2, Event: 1 };

export function getTopNNotifications(notifications, n = 10) {
  return [...notifications]
    .sort((a, b) => {
      const weightA = TYPE_WEIGHTS[a.Type] || 0;
      const weightB = TYPE_WEIGHTS[b.Type] || 0;
      if (weightA !== weightB) return weightB - weightA;
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, n);
}