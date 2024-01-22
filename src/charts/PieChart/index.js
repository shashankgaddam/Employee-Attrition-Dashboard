import React, { useEffect, useRef } from 'react';
import draw from './vis';

export default function PieChart(props) {

    const chartRef = useRef();

    useEffect(() => {
        draw(props, chartRef.current);
    }, [props]);

    return (
        <div ref={chartRef} className='vis-piechart'/>
    );
}
