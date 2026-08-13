import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useDispatch } from 'react-redux';
import './chartConfig';
import { getAssetCountByStatus } from '../../redux/actions/assetAction';

const STATUS_ORDER = ['Available', 'Assigned', 'UnderMaintenance', 'Lost', 'Retired', 'Dead'];

const STATUS_LABELS = {
  Available: 'Available',
  Assigned: 'Assigned',
  UnderMaintenance: 'Under Maintenance',
  Lost: 'Lost',
  Retired: 'Retired',
  Dead: 'Dead',
};

const STATUS_COLORS = {
  Available: '#22c55e',
  Assigned: '#3b82f6',
  UnderMaintenance: '#f59e0b',
  Lost: '#ef4444',
  Retired: '#6b7280',
  Dead: '#7f1d1d',
};

const AssetStatusGraph = () => {
  const dispatch = useDispatch();
  const [statusData, setStatusData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await dispatch(getAssetCountByStatus());
        if (res?.status === 'success') {
          const newData = res.data.reduce((acc, { status, count }) => {
            acc[status] = count;
            return acc;
          }, {});
          setStatusData(newData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [dispatch]);

  const totalAssets = Object.values(statusData).reduce((sum, count) => sum + count, 0);

  const data = {
    labels: STATUS_ORDER.map((status) => STATUS_LABELS[status]),
    datasets: [
      {
        data: STATUS_ORDER.map((status) => statusData[status] || 0),
        backgroundColor: STATUS_ORDER.map((status) => STATUS_COLORS[status]),
        borderWidth: 0,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 10,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Asset Status
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Where every asset currently sits
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <i className="fas fa-laptop text-blue-600 text-xl"></i>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[180px] flex justify-center items-center">
        <Doughnut data={data} options={options} />

        <div className="absolute text-center">
          <p className="text-sm text-gray-500">
            Total Assets
          </p>

          <h3 className="text-4xl font-bold text-gray-800">
            {totalAssets}
          </h3>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {STATUS_ORDER.map((status) => (
          <div
            key={status}
            className="flex items-center justify-between bg-slate-50 rounded-xl p-3"
          >
            <div>
              <p className="text-xs text-slate-600">
                {STATUS_LABELS[status]}
              </p>

              <h4 className="font-bold text-slate-800">
                {statusData[status] || 0}
              </h4>
            </div>

            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            ></span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AssetStatusGraph;
