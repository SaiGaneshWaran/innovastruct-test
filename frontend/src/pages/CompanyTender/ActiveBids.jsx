import  { useState, useEffect } from 'react';
import CompanyNavbar from '../../components/CompanyNavbar';
import bidService from '../../services/bidService';
import userService from '../../services/userService';
import {
  Clock, TrendingUp, AlertTriangle, CheckCircle, DollarSign,
  FileText, Users, ArrowUpRight, Sparkles, Download, Search,
   SortAsc, SortDesc
} from 'lucide-react';




const ActiveBids = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [bids, setBids] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'submissionDate', direction: 'desc' });
  const [setSelectedBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [clientNames, setClientNames] = useState({});

  // Get user details and company ID
  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        setError('Please log in to view your bids.');
        setLoading(false);
        return;
      }

      try {
        const userDetails = await userService.getUserById(currentUser.id);
        if (!userDetails.companyId) {
          setError('No company ID found for your account.');
          setLoading(false);
          return;
        }
        setCompanyId(userDetails.companyId);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setIsSidebarMinimized(event.detail);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  // Fetch bids data from API
  useEffect(() => {
    const fetchBids = async () => {
      if (!companyId) {
        return;
      }

      setLoading(true);
      try {
        const data = await bidService.getBidsByCompanyId(companyId);
        setBids(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bids:', err);
        setError('Failed to load bids. Please try again later.');
        // Fallback to empty array if API fails
        setBids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [companyId]);

  // Fetch client names for all bids
  useEffect(() => {
    const fetchClientNames = async () => {
      const newNames = { ...clientNames };
      const fetchPromises = [];

      for (const bid of bids) {
        if (bid.clientId && !newNames[bid.clientId]) {
          fetchPromises.push(
            userService.getUserById(bid.clientId)
              .then(clientDetails => {
                newNames[bid.clientId] = clientDetails.name || clientDetails.email;
              })
              .catch(err => {
                console.error('Error fetching client details:', err);
                newNames[bid.clientId] = 'Unknown Client';
              })
          );
        }
      }

      if (fetchPromises.length > 0) {
        await Promise.all(fetchPromises);
        setClientNames(newNames);
      }
    };

    if (bids.length > 0) {
      fetchClientNames();
    }
  }, [bids]);

  const handleSort = (field) => {
    const newDirection = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction: newDirection });

    const sortedBids = [...bids].sort((a, b) => {
      if (field === 'amount' || field === 'competitorCount') {
        return newDirection === 'asc' ? a[field] - b[field] : b[field] - a[field];
      }
      if (field === 'createdAt' || field === 'deadline') {
        return newDirection === 'asc'
          ? new Date(a[field]) - new Date(b[field])
          : new Date(b[field]) - new Date(a[field]);
      }
      return newDirection === 'asc'
        ? String(a[field]).localeCompare(String(b[field]))
        : String(b[field]).localeCompare(String(a[field]));
    });

    // Preserve client names when setting sorted bids
    const sortedBidsWithNames = sortedBids.map(bid => ({
      ...bid,
      clientName: clientNames[bid.clientId] || 'Loading...'
    }));

    setBids(sortedBidsWithNames);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (bids.length > 0) {
      const allBids = bids.map(bid => ({
        ...bid,
        clientName: clientNames[bid.clientId] || 'Loading...'
      }));

      const filtered = allBids.filter(bid =>
        bid.tenderTitle.toLowerCase().includes(query.toLowerCase()) ||
        (clientNames[bid.clientId] || '').toLowerCase().includes(query.toLowerCase())
      );
      setBids(filtered);
    }
  };

  const handleStatusChange = async (status) => {
    setSelectedStatus(status);
    setLoading(true);

    try {
      let filteredBids;
      const allBids = await bidService.getBidsByCompanyId(companyId);

      if (status === 'all') {
        filteredBids = allBids;
      } else {
        filteredBids = allBids.filter(bid => bid.status === status);
      }

      // Preserve existing client names
      const newBids = filteredBids.map(bid => ({
        ...bid,
        clientName: clientNames[bid.clientId] || 'Loading...'
      }));

      setBids(newBids);
      setError(null);
    } catch (err) {
      console.error('Error fetching bids by status:', err);
      setError('Failed to filter bids. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getBidStatusInfo = (status) => {
    const statusMap = {
      'pending': {
        color: 'yellow',
        icon: <Clock className="w-5 h-5" />,
        text: 'Pending Review'
      },
      'under-review': {
        color: 'blue',
        icon: <FileText className="w-5 h-5" />,
        text: 'Under Review'
      },
      'accepted': {
        color: 'green',
        icon: <CheckCircle className="w-5 h-5" />,
        text: 'Accepted'
      },
      'rejected': {
        color: 'red',
        icon: <AlertTriangle className="w-5 h-5" />,
        text: 'Rejected'
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CompanyNavbar />
      <div className={`flex-1 p-4 sm:p-8 transition-all duration-300 ${
        isSidebarMinimized ? 'ml-20' : 'ml-80'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative mb-8 overflow-hidden bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="relative z-10">
              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Active Bids</h1>
              <p className="text-gray-600">Track and manage your tender submissions</p>
            </div>

            {/* Search Bar */}
            <div className="mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bids..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20"></div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: 'Total Active Bids',
                value: bids.filter(b => b.status === 'pending' || b.status === 'under-review').length,
                icon: <FileText className="w-6 h-6 text-yellow-600" />,
                bgColor: 'bg-yellow-100'
              },
              {
                title: 'Under Review',
                value: bids.filter(b => b.status === 'under-review').length,
                icon: <Users className="w-6 h-6 text-blue-600" />,
                bgColor: 'bg-blue-100'
              },
              {
                title: 'Success Rate',
                value: bids.length > 0
                  ? `${Math.round((bids.filter(b => b.status === 'accepted').length / bids.length) * 100)}%`
                  : '0%',
                icon: <TrendingUp className="w-6 h-6 text-green-600" />,
                bgColor: 'bg-green-100'
              },
              {
                title: 'Total Bid Value',
                value: `$${bids.reduce((sum, bid) => sum + (bid.amount || 0), 0).toLocaleString()}`,
                icon: <DollarSign className="w-6 h-6 text-purple-600" />,
                bgColor: 'bg-purple-100'
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Bids List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Bids</h2>

                {/* Sort Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSort('amount')}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-600"
                    >
                      Amount {sortConfig.field === 'amount' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-600"
                    >
                      Date {sortConfig.field === 'createdAt' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Status Filters */}
                  <div className="flex gap-2">
                    {['all', 'pending', 'under-review', 'accepted', 'rejected'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedStatus === status
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bids Grid */}
            <div className="divide-y divide-gray-200">
              {bids.map(bid => {
                const statusInfo = getBidStatusInfo(bid.status);
                return (
                  <div key={bid.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {bid.tenderTitle}
                        </h3>
                        <p className="text-sm text-gray-500">Client: {clientNames[bid.clientId] || 'Loading...'}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}
                      >
                        {statusInfo.icon}
                        <span className="ml-2">{statusInfo.text}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Bid Amount</p>
                        <p className="font-semibold text-gray-900">${(bid.amount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Original Budget</p>
                        <p className="font-semibold text-gray-900">${(bid.originalBudget || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Submission Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(bid.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {bid.competitorCount} competitors
                        </div>
                        <div className="flex items-center text-sm text-green-600">
                          <Sparkles className="w-4 h-4 mr-1" />
                          {bid.bidStrength} strength
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(bid.documents || []).map((doc, index) => (
                          <button
                            key={index}
                            className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-gray-100
                              rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            {doc.name}
                          </button>
                        ))}
                        <button
                          onClick={() => setSelectedBid(bid)}
                          className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white
                            rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium
                            group ml-2"
                        >
                          View Details
                          <ArrowUpRight className="w-4 h-4 ml-2 transform group-hover:translate-x-0.5
                            group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveBids;