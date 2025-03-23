import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import userService from '../../services/userService';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2, TrendingUp, Loader2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold">
              LKR {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ),
  label: PropTypes.string
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: ''
};

const BidStatistics = () => {
  const [bidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  // Fetch company ID when component mounts
  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const currentUser = userService.getCurrentUser();
        if (!currentUser) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const userDetails = await userService.getUserById(currentUser.id);
        if (!userDetails.companyId) {
          setError('Company ID not found');
          setLoading(false);
          return;
        }
        setCompanyId(userDetails.companyId);
      } catch (err) {
        console.error('Error fetching company ID:', err);
        setError('Failed to load company ID');
        setLoading(false);
      }
    };

    fetchCompanyId();
  }, []);

  // Fetch bid statistics when companyId is available
  useEffect(() => {
    const fetchBidAnalytics = async () => {
      if (!companyId) return;

      try {
        setLoading(true);
        const response = await analyticsService.getBidAnalytics(companyId);

        const transformedData = Object.entries(response.categories || {}).map(([category, stats]) => ({
          category,
          minBid: stats.minBid,
          maxBid: stats.maxBid,
          avgBid: stats.avgBid,
          count: stats.count,
          totalBids: stats.totalBids
        }));

        setBidData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching bid analytics:', err);
        setError('Failed to load bid analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchBidAnalytics();
  }, [companyId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center h-80">
          <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center h-80 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  const currentCategory = bidData[0]?.category || 'All Categories';
  const bidTypes = ['Min', 'Avg', 'Max'].map(type => ({
    key: type,
    label: `${type} Bid`,
    value: bidData[0]?.[`${type.toLowerCase()}Bid`] || 0,
    count: bidData[0]?.count || 0,
    totalBids: bidData[0]?.totalBids || 0
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-400 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-full">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Bid Analysis</h2>
            <p className="text-white/80 mt-1 text-sm">Project category bid ranges</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {bidTypes.map(({ key, label, value, count, totalBids }) => (
            <div key={key} className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center gap-2 text-yellow-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                LKR {value?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {currentCategory} ({count} projects, {totalBids} bids)
              </div>
            </div>
          ))}
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bidData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="category"
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="minBid"
                name="Minimum Bid"
                fill="#EAB308"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="avgBid"
                name="Average Bid"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="maxBid"
                name="Maximum Bid"
                fill="#D97706"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BidStatistics;