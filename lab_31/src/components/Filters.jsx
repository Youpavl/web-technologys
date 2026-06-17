import React from 'react';

function Filters({ level, setLevel, freeOnly, setFreeOnly, newOnly, setNewOnly,
                   search, setSearch, sort, setSort, view, setView, count 
}) {
  return (
    <div>
      {/* Рядок фільтрів */}
      <div className="flex flex-wrap items-center justify-between bg-white
                      border border-gray-200 rounded-lg px-5 py-3 mb-3"
      >
        <div className="flex items-center gap-5 flex-wrap">
          <label className="text-sm">
            Level:{' '}
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>

          <label className="text-sm flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={e => setFreeOnly(e.target.checked)}
              className="accent-emerald-600"
            />
            Only Free Courses
          </label>

          <label className="text-sm flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={newOnly}
              onChange={e => setNewOnly(e.target.checked)}
              className="accent-emerald-600"
            />
            Only New Courses
          </label>
        </div>

        <span className="text-sm text-gray-500">
          Found: {count} courses
        </span>
      </div>

      {/* Пошук, сортування, вигляд */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-56"
        />

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        >
          <option value="default">Sort by...</option>
          <option value="duration-asc">Duration ↑</option>
          <option value="duration-desc">Duration ↓</option>
          <option value="name-asc">Name A-Z</option>
        </select>

        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1.5 border rounded text-sm ${
              view === 'grid'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            ▦ Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 border rounded text-sm ${
              view === 'list'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            ☰ List
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filters;
