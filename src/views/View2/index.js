import React from 'react';
import './view2.css';
import PieChart from '../../charts/PieChart';

const View2 = ({ data }) => {
  const width = 260;
  const height = 260;
  return (
    <div id='view2' className='pane'>
      <div className='header'>Gender</div>
      <PieChart data={data} width={width} height={height} />
    </div>
  )
}

export default View2;