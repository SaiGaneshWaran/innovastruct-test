import { useState, useEffect } from 'react';
import CompanyNavbar from '../../components/CompanyNavbar';
import FilterSection from '../../components/companyTender/FilterSection';
import TenderCard from '../../components/companyTender/TenderCard.jsx';
import TenderChatbot from '../../components/companyTender/TenderChatbot.jsx';
import {
  Search, AlertCircle, MapPin, TrendingUp, FileText,
  HardHat, Building, Hammer, Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TenderDetailModal from '../../components/companyTender/TenderDetailModal.jsx';
import tenderService from '../../services/tenderService';
import userService from '../../services/userService';
const CompanyTenderDashboard = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [selectedTender, setSelectedTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTenders: 0,
    activeBids: 0,
    urgentTenders: 0,
    averageBudget: 0
  });

  // Function to fetch tenders
  const fetchTenders = async () => {
    try {
      const currentUser = userService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'COMPANY') {
        navigate('/company/login');
        return;
      }

      setLoading(true);
      const data = await tenderService.getAllTenders();

      // Add priority based on deadline proximity
      const tendersWithPriority = data.map(tender => {
        const deadlineDate = new Date(tender.deadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        let priority = 'medium';
        if (daysLeft <= 5) priority = 'hot';
        else if (daysLeft <= 10) priority = 'high';

        return {
          ...tender,
          priority,
          daysLeft: daysLeft > 0 ? daysLeft : 0
        };
      });

      setTenders(tendersWithPriority);
      setFilteredTenders(tendersWithPriority);

      // Calculate stats
      setStats({
        totalTenders: tendersWithPriority.length,
        activeBids: tendersWithPriority.filter(t => t.status === 'new' || t.status === 'active').length,
        urgentTenders: tendersWithPriority.filter(t => t.priority === 'hot').length,
        averageBudget: tendersWithPriority.length > 0
          ? Math.round(tendersWithPriority.reduce((acc, curr) => acc + curr.budget, 0) / tendersWithPriority.length)
          : 0
      });
    } catch (err) {
      console.error('Error fetching tenders:', err);
      setError('Failed to load tenders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tenders on component mount
  useEffect(() => {
    fetchTenders();
  }, [navigate]);

  // Sidebar state management
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setIsSidebarMinimized(event.detail);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  // Tender selection handlers
  const handleTenderClick = (tender) => {
    setSelectedTender(tender);
  };

  const handleCloseModal = () => {
    setSelectedTender(null);
  };

  // Filter handling
  const handleFilterChange = (filters) => {
    let filtered = [...tenders];

    // Location filter (case-insensitive)
    if (filters.location) {
      filtered = filtered.filter(tender =>
        tender.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(tender =>
        tender.category === filters.category
      );
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(tender =>
        tender.priority === filters.priority
      );
    }

    // Budget filter
    if (filters.budget) {
      const [min, max] = filters.budget.split('-').map(Number);
      filtered = filtered.filter(tender => {
        if (!max) return tender.budget >= min;
        return tender.budget >= min && tender.budget <= max;
      });
    }

    // Days Left filter
    if (filters.daysLeft) {
      const [min, max] = filters.daysLeft;
      filtered = filtered.filter(tender =>
        tender.daysLeft >= min && tender.daysLeft <= max
      );
    }

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTenders(filtered);
  };
  // Search handling





  return (
    <div className="flex h-screen bg-gray-50">
      <CompanyNavbar />
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarMinimized ? 'ml-20' : 'ml-80'
      }`}>
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          {/* Enhanced Header Section */}
<div className="mb-8">
  <div className="flex items-center gap-3 mb-6">
    <HardHat className="w-10 h-10 text-yellow-500" />
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Tender Dashboard</h1>
      <p className="text-gray-600 mt-2">Find and manage construction tender opportunities</p>
    </div>
  </div>

  {/* Quick Stats Section */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
      <div className="flex items-center gap-3">
        <Building className="w-8 h-8 text-yellow-500" />
        <div>
          <p className="text-sm text-gray-600">Total Tenders</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalTenders}</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
      <div className="flex items-center gap-3">
        <Hammer className="w-8 h-8 text-green-500" />
        <div>
          <p className="text-sm text-gray-600">Active Bids</p>
          <p className="text-2xl font-bold text-gray-800">{stats.activeBids}</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-red-500" />
        <div>
          <p className="text-sm text-gray-600">Urgent Tenders</p>
          <p className="text-2xl font-bold text-gray-800">{stats.urgentTenders}</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-blue-500" />
        <div>
          <p className="text-sm text-gray-600">Avg. Budget</p>
          <p className="text-2xl font-bold text-gray-800">
            ${(stats.averageBudget / 1000).toFixed(0)}k
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

          <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-4">
              {/* Filter Tenders - Primary Action */}
              <button
                onClick={() => document.querySelector('input[type="text"]').focus()}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400
                  text-white rounded-lg hover:from-yellow-600 hover:to-yellow-500 transition-all group"
              >
                <Search className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Filter Tenders</div>
                  <div className="text-xs opacity-90">Search and filter opportunities</div>
                </div>
              </button>

              {/* Active Bids - Secondary Action */}
              <button
                onClick={() => navigate('/company/tender/bids')}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100
                  text-gray-700 rounded-lg hover:from-yellow-50 hover:to-yellow-100
                  hover:text-yellow-700 border border-gray-200 transition-all group"
              >
                <FileText className="w-5 h-5 text-yellow-600" />
                <div className="text-left">
                  <div className="font-medium">Active Bids</div>
                  <div className="text-xs text-gray-500 group-hover:text-yellow-600">
                    Track your bid submissions
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/company/tender/analytics')}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100
                  text-gray-700 rounded-lg hover:from-yellow-50 hover:to-yellow-100
                  hover:text-yellow-700 border border-gray-200 transition-all group"
              >
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <div className="text-left">
                  <div className="font-medium">Analytics</div>
                  <div className="text-xs text-gray-500 group-hover:text-yellow-600">
                    View performance metrics
                  </div>
                </div>
              </button>
              <button
                onClick={() => navigate('/company/tender/heatmap')}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100
                  text-gray-700 rounded-lg hover:from-yellow-50 hover:to-yellow-100
                  hover:text-yellow-700 border border-gray-200 transition-all group"
              >
                <MapPin className="w-5 h-5 text-yellow-600" />
                <div className="text-left">
                  <div className="font-medium">Heatmap</div>
                  <div className="text-xs text-gray-500 group-hover:text-yellow-600">
                    Geographic distribution
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenders..."
              className="pl-12 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange({});
              }}
            />
          </div>
          {filteredTenders.length === 0 && (
  <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">No tenders found</h3>
    <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
    <button
      onClick={() => {
        setSearchQuery('');
        handleFilterChange({});
      }}
      className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
    >
      Reset Filters
    </button>
  </div>
)}

          {/* Filter Section */}
          <FilterSection onFilterChange={handleFilterChange} />

          {/* Tender Cards Grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredTenders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTenders.map(tender => tender && tender.title ? (
                <TenderCard
                  key={tender.id}
                  tender={tender}
                  onTenderClick={handleTenderClick}
                  onBidSubmit={() => fetchTenders()}
                />
              ) : null)}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No tenders found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
          {selectedTender && (
      <TenderDetailModal
        tender={selectedTender}
        onClose={handleCloseModal}
      />
    )}

          {/* Chatbot */}
          <TenderChatbot userType="company" />
        </div>
      </div>
    </div>
  );
};

export default CompanyTenderDashboard;