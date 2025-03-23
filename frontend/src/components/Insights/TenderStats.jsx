import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowUp, ArrowDown, Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload || {};
    const isPositive = data.growth?.startsWith('+');

    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-gray-600">Tenders:</span>
            <span className="font-medium">{payload[0]?.value || 0}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-gray-600">Growth:</span>
            <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {data.growth || '0%'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      payload: PropTypes.shape({
        growth: PropTypes.string
      })
    })
  ),
  label: PropTypes.string
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: ''
};

const TenderStats = () => {
  const [tenderData, setTenderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenderActivity = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getTenderActivity();
        setTenderData(response.tenderData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tender activity:', err);
        setError('Failed to load tender activity data');
        setLoading(false);
      }
    };

    fetchTenderActivity();
  }, []);

  const getStats = () => {
    if (!tenderData || tenderData.length === 0) {
      return { current: 0, growth: 0 };
    }
    const latestTenders = tenderData[tenderData.length - 1].tenders;
    const previousTenders = tenderData[tenderData.length - 2]?.tenders || 0;
    const growth = previousTenders === 0 ? 0 : ((latestTenders - previousTenders) / previousTenders * 100).toFixed(1);
    return { current: latestTenders, growth };
  };

  const stats = getStats();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-400 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-full">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Tender Activity</h2>
            <p className="text-white/80 mt-1 text-sm">Monthly tender trends</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Current Month</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.current} Tenders
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Monthly Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{stats.growth}%</span>
              {Number(stats.growth) > 0 ? (
                <ArrowUp className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDown className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tenderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="tenders"
                stroke="#EAB308"
                strokeWidth={2}
                dot={{ fill: '#EAB308', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#EAB308' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TenderStats;