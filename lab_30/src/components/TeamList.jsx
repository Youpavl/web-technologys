import React from 'react';
import Team from './Team';

function TeamList({ teams }) {
  return (
    <div className="team-list">
      {teams.map((team) => (
        <Team
          key={team.id}
          name={team.name}
          description={team.description}
          color={team.color}
          members={team.members}
        />
      ))}
    </div>
  );
}

export default TeamList;
