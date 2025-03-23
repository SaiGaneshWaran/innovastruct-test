import React, { useState, useEffect } from 'react';
import { Building, Star, MapPin, Activity, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import companyService from '../../services/companyService';

const ContractorsList = () => {
  const [topContractors, setTopContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopContractors = async () => {
      try {
        setLoading(true);
        const companies = await companyService.getAllCompanies();
        const sorted = companies
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
        setTopContractors(sorted);
        setError(null);
      } catch (err) {
        console.error('Error fetching top contractors:', err);
        setError('Failed to load top contractors');
      } finally {
        setLoading(false);
      }
    };

    fetchTopContractors();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-amber-400 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-full">
            <Building className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Top Rated Contractors</h2>
        </div>
        <p className="text-white/80 mt-2">Leading construction companies in your region</p>
      </div>

      <div className="divide-y divide-gray-100">
        {topContractors.map((contractor) => (
          <Link
            key={contractor.id}
            to={`/client/companies/${contractor.id}`}
            className="block hover:bg-gray-50 transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {contractor.profileIcon ? (
                    <img
                      src={contractor.profileIcon}
                      alt={contractor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-yellow-50 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-yellow-600" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contractor.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{contractor.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      <span>{contractor.projects?.length || 0} Projects</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{contractor.employees} Employees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <Link
          to="/client/companies"
          className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center justify-center"
        >
          View all contractors
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ContractorsList;