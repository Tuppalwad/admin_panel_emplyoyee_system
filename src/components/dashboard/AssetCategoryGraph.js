import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useDispatch } from 'react-redux';
import './chartConfig';
import { getAssetCountByCategory } from '../../redux/actions/assetAction';

const AssetCategoryGraph = () => {
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await dispatch(getAssetCountByCategory());
        if (res?.status === 'success') {
          setCategoryData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch]);

  const data = {
    labels: categoryData.map((item) => item.category),
    datasets: [
      {
        label: 'Assets',
        data: categoryData.map((item) => item.count),
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        maxBarThickness: 42,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: '#f1f5f9' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Assets by Category
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Equipment mix across the company
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <i className="fas fa-layer-group text-purple-600 text-xl"></i>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[320px]">
        <Bar data={data} options={options} />
      </div>

    </div>
  );
};

export default AssetCategoryGraph;
