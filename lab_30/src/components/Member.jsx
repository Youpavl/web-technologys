import React from 'react';

function Member({ name, role, avatar, skills, teamColor }) {
  return (
    <div className={`member-card member-card--${teamColor}`}>
      <div className="member-card__top">
        <div className="member-card__avatar">{avatar}</div>
        <div className="member-card__info">
          <div className="member-card__name">{name}</div>
          <div className="member-card__role">{role}</div>
        </div>
      </div>
      <div className="member-card__skills">
        {skills.map((skill, index) => (
          <span key={index} className="member-card__skill">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Member;
