import React, { useEffect, useRef } from 'react';
import draw from './vis';

const ScatterPlot = (props) => {
  const visRef = useRef(null);

  useEffect(() => {
    draw(visRef.current, props);
  }, [props]);

  return <div className='vis-scatterplot' ref={visRef} />;
};

export default ScatterPlot;
