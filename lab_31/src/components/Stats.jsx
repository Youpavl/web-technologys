import React from 'react';

function Stats({ courses }) {
  const total = courses.length;
  const freeCount = courses.filter(c => c.isFree).length;
  const avgDuration = total > 0
    ? (courses.reduce((sum, c) => sum + c.duration, 0) / total).toFixed(1)
    : 0;

  return (
    <div className="flex gap-5 mb-4 flex-wrap">
      <div className="bg-white border border-gray-200 rounded px-4 py-2 text-sm">
        <strong>Total courses:</strong> {total}
      </div>
      <div className="bg-white border border-gray-200 rounded px-4 py-2 text-sm">
        <strong>Free courses:</strong> {freeCount}
      </div>
      <div className="bg-white border border-gray-200 rounded px-4 py-2 text-sm">
        <strong>Avg duration:</strong> {avgDuration} hours
      </div>
    </div>
  );
}

export default Stats;
