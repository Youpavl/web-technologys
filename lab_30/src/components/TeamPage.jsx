import React from 'react';
import TeamHeader from './TeamHeader';
import TeamList from './TeamList';
import TeamFooter from './TeamFooter';
import { teams } from '../data/teams';

function TeamPage() {
  return (
    <div className="team-page">
      <TeamHeader />
      <TeamList teams={teams} />
      <TeamFooter />
    </div>
  );
}

export default TeamPage;
