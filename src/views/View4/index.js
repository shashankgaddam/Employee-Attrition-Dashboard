import React from 'react';
import './view4.css';
import LineChart from '../../charts/LineChart';

const View4 = ({ user }) => {
  const width = 1100;
  const height = 250;

  return (
    <div id='view4' className='pane' >
      <div className='header'>User Activities</div>
      <div style={{ overflowX: 'scroll', overflowY: 'hidden' }}>
        <LineChart data={user} width={width} height={height} />
      </div>
    </div>
  )
}

export default View4;