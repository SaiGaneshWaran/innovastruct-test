import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyNavbar from '../../components/CompanyNavbar';
import CreatePortfolioForm from './CreatePortfolioForm.jsx';
import userService from '../../services/userService';
import companyService from '../../services/companyService';
import CompanyProfile from '../../components/CompanyProfile/CompanyProfile';
import axios from 'axios';

const CompanyPortfolio = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setIsSidebarMinimized(event.detail);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  const transformCompanyData = (data) => {
    return {
      ...data,
      // Map projects to match the expected structure
      projects: data.projects?.map(project => ({
        ...project,
        imageIds: project.imageIds || [], // Use the imageIds array directly
        title: project.title || "",
        description: project.description || "",
        year: project.year || new Date().getFullYear()
      })) || [],

      // Keep original certifications array for displaying images
      certifications: data.certifications || [],

      // Map certifications to match the expected structure for compliance section
      certificationsCompliance: {
        industryCertifications: data.certifications?.map(cert => ({
          certification: cert.name,
          description: `Issued by ${cert.organization} on ${cert.issueDate}${cert.expiryDate ? `, expires on ${cert.expiryDate}` : ''}`
        })) || [],
        safetyStandards: [] // Add safety standards if available in the future
      },

      // Map financial stability data
      financialStability: {
        annualRevenue: data.annualRevenue || 'Not specified',
        growthRate: 'N/A',
        creditRating: 'N/A',
        financialHealth: {
          cashReserves: 'N/A',
          debtToEquityRatio: 'N/A',
          longTermStability: 'Financial health information not available'
        }
      },

      // Map services offered
      servicesOffered: {
        primaryServices: data.services || [],
        specializedServices: [] // Add specialized services if available in the future
      },

      // Map contact information
      contactInfo: {
        email: data.email || null,
        phone: data.phoneNumber || null,
        website: data.website || null
      },

      // Map track record
      trackRecord: {
        yearsOfExperience: data.established ? new Date().getFullYear() - parseInt(data.established) : 0,
        notableProjects: data.projects?.map(project => ({
          imageIds: project.imageIds || [], // Use the imageIds array directly
          title: project.title || '',
          description: project.description || ''
        })) || [],
        clientSatisfaction: {
          averageRating: data.rating || 0,
          positiveFeedback: [] // Add feedback if available in the future
        }
      },

      // Map awards and recognitions
      awardsRecognitions: {
        majorAwards: [],
        industryRecognition: [],
        mediaFeatures: []
      }
    };
  };

  useEffect(() => {
    const checkPortfolio = async () => {
      try {
        setLoading(true);

        if (id) {
          // If we have an ID parameter, fetch and show that company's portfolio
          const companyData = await companyService.getCompanyById(id);
          const transformedData = transformCompanyData(companyData);
          setCompany(transformedData);
          setLoading(false);
          return;
        }

        // Otherwise check if current user's company has a portfolio
        const currentUser = userService.getCurrentUser();
        if (!currentUser) {
          throw new Error("No logged-in user found");
        }

        const completeUserData = await userService.getUserById(currentUser.id);
        if (!completeUserData || !completeUserData.companyId) {
          throw new Error("No company ID found for the logged-in user");
        }

        // Check if company has a portfolio
        const response = await axios.get(`http://localhost:8080/api/companies/${completeUserData.companyId}`);
        const company = response.data;

        // If company has required portfolio fields, redirect to the portfolio view
        if (company.shortDescription && company.services && company.services.length > 0) {
          navigate(`/company/portfolio/${completeUserData.companyId}`);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking portfolio:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    checkPortfolio();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex">
        <CompanyNavbar />
        <div className={`flex-1 transition-all duration-300 ${isSidebarMinimized ? 'ml-20' : 'ml-80'}`}>
          <div className="flex justify-center items-center min-h-screen">
            <div className="loading loading-spinner loading-lg text-yellow-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <CompanyNavbar />
        <div className={`flex-1 transition-all duration-300 ${isSidebarMinimized ? 'ml-20' : 'ml-80'}`}>
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // If we have a company, show the portfolio view
  if (company) {
    return (
      <div className="flex min-h-screen">
        <CompanyNavbar />
        <div className={`flex-1 transition-all duration-300 ${isSidebarMinimized ? 'ml-20' : 'ml-80'}`}>
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Company Portfolio</h1>
              <button
                onClick={() => navigate(`/company/portfolio/${id}/edit`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Edit Portfolio
              </button>
            </div>
            <CompanyProfile company={company} />
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show the create portfolio form
  return (
    <div className="flex">
      <CompanyNavbar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarMinimized ? 'ml-20' : 'ml-80'
        }`}
      >
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="w-full max-w-4xl px-4">
            {!showCreateForm ? (
              <div className="flex flex-col items-center justify-center -mt-20">
                <div className="max-w-xl w-full text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Create Your Company Portfolio
                  </h1>
                  <p className="text-gray-600 mb-8">
                    Showcase your company's expertise, past projects, and achievements to attract potential clients.
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Portfolio
                  </button>
                </div>
              </div>
            ) : (
              <CreatePortfolioForm onCancel={() => setShowCreateForm(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPortfolio;