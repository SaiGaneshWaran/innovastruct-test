import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, FileText, Settings, Plus, Activity, Briefcase, Bell } from 'lucide-react';
import AdsSlideshow from '../../components/AdsSlideshow';
import ClientNavbar from '../../components/ClientNavbar';
import dashboardService from '../../services/dashboardService';
import userService from '../../services/userService';

const Home = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setIsSidebarMinimized(event.detail);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  useEffect(() => {
    // Get current user's name
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      setClientName(currentUser.name);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summary = await dashboardService.getClientDashboardSummary();
        setDashboardData(summary);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const activities = await dashboardService.getRecentTenderActivity();
        const formattedActivities = activities.map(activity => {
          let text = '';
          let icon = <Activity />;
          let statusColor = 'text-yellow-600';
          let bgColor = 'bg-yellow-100';

          switch (activity.status) {
            case 'new':
              text = `New tender created: "${activity.title}"`;
              icon = <Bell />;
              statusColor = 'text-blue-600';
              bgColor = 'bg-blue-100';
              break;
            case 'active':
              text = `Tender "${activity.title}" is now active`;
              icon = <Activity />;
              statusColor = 'text-green-600';
              bgColor = 'bg-green-100';
              break;
            case 'ended':
              text = `Tender "${activity.title}" has ended`;
              icon = <Briefcase />;
              statusColor = 'text-gray-600';
              bgColor = 'bg-gray-100';
              break;
            default:
              text = `Tender "${activity.title}" status updated`;
          }

          return {
          id: activity.id,
            text,
          time: new Date(activity.createdAt).toLocaleString(),
            icon,
            statusColor,
            bgColor,
            stats: `${activity.bidsCount} bids | Budget: $${activity.budget.toLocaleString()}`,
            deadline: activity.deadline
          };
        });
        setRecentActivities(formattedActivities);
      } catch (err) {
        console.error('Failed to fetch recent activities:', err);
      }
    };

    fetchRecentActivity();
    const interval = setInterval(fetchRecentActivity, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  }

  const statCards = [
    {
      label: 'Total Tenders',
      extra: `${dashboardData.activeTenders} Active`,
      value: dashboardData.totalTenders
    },
    {
      label: 'Total Bids',
      extra: `${dashboardData.acceptedBids} Accepted`,
      value: dashboardData.totalBids
    },
    {
      label: 'Completed Tenders',
      extra: '',
      value: dashboardData.completedTenders
    },
    {
      label: 'Total Budget',
      extra: '',
      value: `$${Math.round(dashboardData.totalBudget).toLocaleString()}`
    },
  ];

  const mainCards = [
    {
      title: 'Find Builders',
      icon: <Building size={48} />,
      description: 'Browse trusted home builders to bring your dream house to life.',
      link: '/client/companies',
      color: 'bg-gradient-to-r from-yellow-500 to-amber-400',
      stats: `${dashboardData.totalCompanies || 0} builders`
    },
    {
      title: 'Request a Quote',
      icon: <FileText size={48} />,
      description: 'Submit your project details and receive detailed quotes from top builders.',
      link: '/client/tender',
      color: 'bg-gradient-to-r from-yellow-500 to-amber-400',
      stats: `${dashboardData.activeTenders} quotes`,
      action: {
        icon: <Plus size={24} />,
        label: 'Request Quote',
        link: '/client/tender/create'
      }
    }
  ];

  // Updated secondary card for consultations instead of contacts
  const secondaryCards = [
    {
      title: 'Insights',
      icon: <Users size={40} />,
      description: 'Chat with home design experts for personalized advice.',
      link: '/client/insights',
      color: 'bg-amber-400',
    },
    {
      title: 'Settings',
      icon: <Settings size={40} />,
      description: 'Customize your account and project preferences',
      link: '/client/settings',
      color: 'bg-amber-400'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <ClientNavbar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarMinimized ? 'ml-20' : 'ml-80'
        }`}
      >
        <div className="container mx-auto px-4 py-6 h-full overflow-auto">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Hello, <span className="text-yellow-500">{clientName}</span>
            </h1>
            <p className="text-gray-600 mt-2">Let's build your home!</p>
          </div>

          {/* Stats Overview Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{stat.label}</span>
                  {stat.extra && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {stat.extra}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Main Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mainCards.map((card, index) => (
                <div key={index} className="relative group">
                  <Link
                    to={card.link}
                    className={`${card.color} transform hover:scale-102 transition-all duration-200 p-6 sm:p-8 rounded-xl shadow-lg text-white h-full block`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-white/10 rounded-full mr-4">
                          {card.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold">{card.title}</h2>
                          {card.stats && (
                            <p className="text-sm opacity-90 mt-1">{card.stats}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-lg opacity-90 mb-4">{card.description}</p>
                      <div className="mt-auto text-sm opacity-75 flex items-center">
                        <span>View details</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                  {card.action && (
                    <Link
                      to={card.action.link}
                      className="absolute top-4 right-4 bg-white text-yellow-600 hover:bg-yellow-50 p-2 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110"
                      title={card.action.label}
                    >
                      {card.action.icon}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Ads Section */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <AdsSlideshow />
            </div>

            {/* Secondary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {secondaryCards.map((card, index) => (
                <Link
                  key={index}
                  to={card.link}
                  className={`${card.color} transform hover:scale-102 transition-all duration-200 p-4 sm:p-6 rounded-xl shadow-md text-white`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-white/10 rounded-full">
                      {card.icon}
                    </div>
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    {card.count && (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{card.count}</span>
                    )}
                  </div>
                </Link>
              ))}


            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="border-b border-gray-100">
                <h2 className="text-xl font-bold p-5">Recent Activity</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="p-5 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${activity.bgColor}`}>
                        {React.cloneElement(activity.icon, {
                          className: `w-5 h-5 ${activity.statusColor}`
                        })}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{activity.text}</p>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <p className="text-sm text-gray-600">{activity.stats}</p>
                          {activity.deadline && (
                            <p className="text-sm text-gray-600">
                              Deadline: {new Date(activity.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
                {recentActivities.length === 0 && (
                  <li className="p-5 text-center text-gray-500">
                    No recent activities
                  </li>
                )}
              </ul>
            </div>

            {/* Company Switch Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Company Account</h2>
                  <p className="text-gray-600">Switch to your company dashboard</p>
                </div>
                <Link
                  to="/company/home"
                  className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-colors"
                >
                  Switch to Company View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;