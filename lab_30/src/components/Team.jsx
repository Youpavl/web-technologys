import React from 'react';
import Member from './Member';

function Team({ name, description, color, members }) {
  return (
    <div className={`team team--${color}`}>
      <div className="team__header">
        <h2 className="team__name">{name}</h2>
        <p className="team__description">{description}</p>
      </div>
      <div className="team__members">
        {members.map((member) => (
          <Member
            key={member.id}
            name={member.name}
            role={member.role}
            avatar={member.avatar}
            skills={member.skills}
            teamColor={color}
          />
        ))}
      </div>
    </div>
  );
}

export default Team;
