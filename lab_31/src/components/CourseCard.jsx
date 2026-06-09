import React from 'react';

function CourseCard({ course, view }) {
  // кольори рамки залежно від рівня
  const borderColors = {
    beginner: 'border-green-400 bg-green-50',
    intermediate: 'border-yellow-400 bg-yellow-50',
    advanced: 'border-red-400 bg-red-50',
  };

  const cardStyle = borderColors[course.level] || 'border-gray-300 bg-white';

  const levelLabel = course.level.charAt(0).toUpperCase() + course.level.slice(1);

  if (view === 'list') {
    return (
      <div className={`border-2 rounded-lg px-5 py-3 flex items-center gap-4 ${cardStyle}`}>
        <div className="flex gap-1.5">
          {course.isFree && (
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded">
              FREE ✓
            </span>
          )}
          {course.isNew && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded">
              NEW ★
            </span>
          )}
        </div>
        <h3 className="font-bold text-sm">{course.title}</h3>
        <p className="text-xs text-gray-600">Level: {levelLabel}</p>
        <p className="text-xs text-gray-600">Duration: {course.duration} hours</p>
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-xl p-4 ${cardStyle}`}>
      <div className="flex gap-1.5 mb-1">
        {course.isFree && (
          <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded">
            FREE ✓
          </span>
        )}
        {course.isNew && (
          <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded">
            NEW ★
          </span>
        )}
      </div>
      <h3 className="font-bold mt-1.5 mb-2">{course.title}</h3>
      <p className="text-sm text-gray-600">Level: {levelLabel}</p>
      <p className="text-sm text-gray-600">Duration: {course.duration} hours</p>
    </div>
  );
}

export default CourseCard;
