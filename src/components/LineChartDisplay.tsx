import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scale: {
    ticks: {
      precision: 0,
    },
  },
};


export default function LineChartDisplay(props: any) {
  const labels = props.data.map((item:any)=>item[0])
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: props.data.map((item:any)=>item[1]),
        borderColor: 'black',
        backgroundColor: 'black',
      },
    ],
  };
  return <Line options={options} data={data} />
}