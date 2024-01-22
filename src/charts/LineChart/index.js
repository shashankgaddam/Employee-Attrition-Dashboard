import React, { useEffect, useRef } from 'react';
import draw from './vis';

const LineChart = ({ data, width, height }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        draw({
            data: data,
            container: chartRef.current,
            width: width,
            height: height
        });
    }, [data, width, height]);

    return (
        <div className='vis-linechart' ref={chartRef} />
    );
};

export default LineChart;