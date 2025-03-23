// src/pages/company-dashboard/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building, FileText, Settings, Users,
  TrendingUp, Calendar,
  Clock, CheckCircle, AlertTriangle, Activity
} from 'lucide-react';
import CompanyNavbar from '../../components/CompanyNavbar';
import userService from '../../services/userService';
import companyService from '../../services/companyService';
import dashboardService from '../../services/dashboardService';

const CompanyHome = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [statCards, setStatCards] = useState([
    {
      label: 'Active Projects',
      value: '0',
      trend: '0',
      trendUp: true
    },
    {
      label: 'Pending Quotes',
      value: '0',
      trend: '0',
      trendUp: true
    },
    {
      label: 'Project Completion',
      value: '0%',
      trend: '0%',
      trendUp: true
    },
    {
      label: 'Client Satisfaction',
      value: '0',
      trend: '0',
      trendUp: true
    },
  ]);

  const [mainCards, setMainCards] = useState([
    {
      title: 'Project Management',
      icon: <Building size={48} />,
      description: 'Manage all your active and upcoming construction projects.',
      link: '/company/projects',
      color: 'bg-gradient-to-r from-yellow-500 to-amber-400',
      stats: '0 active, 0 pending'
    },
    {
      title: 'Quote Requests',
      icon: <FileText size={48} />,
      description: 'Review new requests for quotes and send proposals.',
      link: '/company/tender',
      color: 'bg-gradient-to-r from-yellow-500 to-amber-400',
      stats: '0 new requests',
      badge: {
        text: 'New',
        count: 0
      }
    }
  ]);

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Get current user's name
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      // Fetch company data to get the company name and stats
      const fetchCompanyData = async () => {
        try {
          const userDetails = await userService.getUserById(currentUser.id);
          if (userDetails && userDetails.companyId) {
            const [companyData, dashboardStats, deadlines, activities] = await Promise.all([
              companyService.getCompanyById(userDetails.companyId),
              companyService.getCompanyDashboardStats(userDetails.companyId),
              companyService.getCompanyUpcomingDeadlines(userDetails.companyId),
              dashboardService.getCompanyRecentActivity(userDetails.companyId)
            ]);

            if (companyData) {
              setCompanyName(companyData.name);
            }

            if (dashboardStats) {
              setStatCards([
                {
                  label: 'Active Projects',
                  value: dashboardStats.activeProjects.toString(),
                  trend: dashboardStats.activeProjects > 0 ? '+' + dashboardStats.activeProjects : '0',
                  trendUp: dashboardStats.activeProjects > 0
                },
                {
                  label: 'Pending Quotes',
                  value: dashboardStats.pendingQuotes.toString(),
                  trend: dashboardStats.pendingQuotes > 0 ? '+' + dashboardStats.pendingQuotes : '0',
                  trendUp: dashboardStats.pendingQuotes > 0
                },
                {
                  label: 'Project Completion',
                  value: `${Math.round(dashboardStats.projectCompletion)}%`,
                  trend: `${Math.round(dashboardStats.projectCompletion)}%`,
                  trendUp: dashboardStats.projectCompletion > 50
                },
                {
                  label: 'Client Satisfaction',
                  value: dashboardStats.clientSatisfaction.toFixed(1),
                  trend: dashboardStats.clientSatisfaction > 8 ? '+0.5' : '-0.1',
                  trendUp: dashboardStats.clientSatisfaction > 8
                }
              ]);

              // Update main cards with real data
              setMainCards([
                {
                  title: 'Project Management',
                  icon: <Building size={48} />,
                  description: 'Manage all your active and upcoming construction projects.',
                  link: '/company/projects',
                  color: 'bg-gradient-to-r from-yellow-500 to-amber-400',
                  stats: `${dashboardStats.activeProjects} active, ${dashboardStats.pendingQuotes} pending`
                },
                {
                  title: 'Quote Requests',
                  icon: <FileText size={48} />,
                  description: 'Review new requests for quotes and send proposals.',
                  link: '/company/tender',
                  color: 'bg-gradient-to-r from-yellow-500 to-amber-400',
                  stats: `${dashboardStats.pendingQuotes} new requests`,
                  badge: {
                    text: 'New',
                    count: dashboardStats.pendingQuotes
                  }
                }
              ]);
            }

            if (deadlines) {
              setUpcomingDeadlines(deadlines);
            }

            if (activities) {
              const formattedActivities = activities.map(activity => {
                let text = '';
                let icon = <Activity />;

                switch (activity.status) {
                  case 'accepted':
                    text = `Bid accepted for "${activity.tenderTitle}"`;
                    icon = <CheckCircle />;
                    break;
                  case 'rejected':
                    text = `Bid rejected for "${activity.tenderTitle}"`;
                    icon = <AlertTriangle />;
                    break;
                  case 'pending':
                    text = `New bid submitted for "${activity.tenderTitle}"`;
                    icon = <FileText />;
                    break;
                  default:
                    text = `Activity for "${activity.tenderTitle}"`;
                }

                return {
                  id: activity.id,
                  text,
                  time: new Date(activity.createdAt).toLocaleString(),
                  icon,
                  status: activity.status,
                  amount: activity.amount
                };
              });
              setRecentActivities(formattedActivities);
            }
          }
        } catch (error) {
          console.error('Error fetching company data:', error);
        }
      };
      fetchCompanyData();
    }

    const handleSidebarStateChange = (event) => {
      setIsSidebarMinimized(event.detail);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  // Quick action tiles
  const quickActionTiles = [
    {
      title: 'Portfolio',
      icon: <Users size={40} />,
      description: 'Manage client relationships and communications.',
      link: '/company/portfolio',
      color: 'bg-amber-400',
    },
    {
      title: 'Tender',
      icon: <Calendar size={40} />,
      description: 'View and manage your project timeline and milestones.',
      link: '/company/tender',
      color: 'bg-amber-400'
    },
    {
      title: 'Performance',
      icon: <TrendingUp size={40} />,
      description: 'Track your company metrics and growth statistics.',
      link: '/company/insights',
      color: 'bg-amber-400'
    },
    {
      title: 'Settings',
      icon: <Settings size={40} />,
      description: 'Update your company profile and preferences.',
      link: '/company/settings',
      color: 'bg-amber-400'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <CompanyNavbar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarMinimized ? 'ml-20' : 'ml-80'
        }`}
      >
        <div className="h-full overflow-auto">
          <div className="container mx-auto px-4 py-6">
            {/* Welcome Message */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Welcome, <span className="text-yellow-500">{companyName}</span>
              </h1>
              <p className="text-gray-600 mt-2">Company Dashboard Overview</p>
            </div>

            {/* Stats Overview Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {statCards.map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      stat.trendUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {/* Main Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mainCards.map((card, index) => (
                  <div key={index} className="relative group">

                  <Link
  to="/company/insights"
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
                    {card.badge && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        {card.badge.count} {card.badge.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-100 p-5 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Upcoming Deadlines</h2>
                  <Link to="/company/tender" className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                    View all
                  </Link>
                </div>
                <ul className="divide-y divide-gray-100">
                  {upcomingDeadlines.map((deadline) => (
                    <li key={deadline.id} className="p-5 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{deadline.project}</h3>
                          <div className="flex items-center mt-1">
                            <Clock className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">{new Date(deadline.deadline).toLocaleDateString()}</span>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              deadline.daysLeft <= 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {deadline.daysLeft} days left
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-3">{deadline.completion}%</span>
                            <div className="w-48 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-yellow-500 h-2.5 rounded-full"
                                style={{ width: `${deadline.completion}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                  {upcomingDeadlines.length === 0 && (
                    <li className="p-5 text-center text-gray-500">
                      No upcoming deadlines
                    </li>
                  )}
                </ul>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {quickActionTiles.map((tile, index) => (
                  <Link
                    key={index}
                    to={tile.link}
                    className={`${tile.color} transform hover:scale-102 transition-all duration-200 p-4 sm:p-6 rounded-xl shadow-md text-white`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-white/10 rounded-full">
                        {tile.icon}
                      </div>
                      <h2 className="text-xl font-semibold">{tile.title}</h2>
                      {tile.count && (
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{tile.count}</span>
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
                        <div className={`p-2 rounded-full ${
                          activity.status === 'accepted' ? 'bg-green-100' :
                          activity.status === 'rejected' ? 'bg-red-100' :
                          'bg-yellow-100'
                        }`}>
                          {React.cloneElement(activity.icon, {
                            className: `w-5 h-5 ${
                              activity.status === 'accepted' ? 'text-green-600' :
                              activity.status === 'rejected' ? 'text-red-600' :
                              'text-yellow-600'
                            }`
                          })}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{activity.text}</p>
                          {activity.amount && (
                            <p className="text-sm text-gray-600 mt-1">
                              Amount: ${activity.amount.toLocaleString()}
                            </p>
                          )}
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

              {/* Switch to Client Dashboard */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Client Account</h2>
                    <p className="text-gray-600">Switch to your Client dashboard</p>
                  </div>
                  <Link
                    to="/client/home"
                    className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md transition-colors"
                  >
                    Switch to Client View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHome;