import React from 'react';

const LawmakerCommittees = ({ committees }) => {
  return <div >
    <ul>
      {committees.map(c => <li key={c.committee}>{c.committee}{(c.role !== 'Member') ? ` - ${c.role} ${(c.role === 'Chair') ? '🪑' : ''}` : null} </li>)}
    </ul>
  </div>
};

export default LawmakerCommittees