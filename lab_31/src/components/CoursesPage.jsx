import React, { useState } from 'react';
import { courses } from '../data/coursesData';
import Filters from './Filters';
import Stats from './Stats';
import CourseCard from './CourseCard';

function CoursesPage() {
  const [level, setLevel] = useState('all');
  const [freeOnly, setFreeOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('grid');

  // фільтрація
  let filtered = [...courses];

  if (level !== 'all') {
    filtered = filtered.filter(c => c.level === level);
  }
  if (freeOnly) {
    filtered = filtered.filter(c => c.isFree);
  }
  if (newOnly) {
    filtered = filtered.filter(c => c.isNew);
  }
  if (search.trim()) {
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // сортування
  if (sort === 'duration-asc') {
    filtered.sort((a, b) => a.duration - b.duration);
  } else if (sort === 'duration-desc') {
    filtered.sort((a, b) => b.duration - a.duration);
  } else if (sort === 'name-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-emerald-700 mb-4">
        Available Courses
      </h1>

      <Filters
        level={level}
        setLevel={setLevel}
        freeOnly={freeOnly}
        setFreeOnly={setFreeOnly}
        newOnly={newOnly}
        setNewOnly={setNewOnly}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        view={view}
        setView={setView}
        count={filtered.length}
      />

      <Stats courses={filtered} />

      <div className={
        view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
          : 'flex flex-col gap-3'
      }>
        {filtered.length > 0 ? (
          filtered.map(course => (
            <CourseCard key={course.id} course={course} view={view} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-lg py-10">
            No courses found 😕
          </p>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;
