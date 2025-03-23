import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CompanyProfile from '../../components/CompanyProfile/CompanyProfile';
import ClientNavbar from '../../components/ClientNavbar';
import companyService from '../../services/companyService';

const CompanyProfilePage = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const data = await companyService.getCompanyById(id);

      // Transform the API response to match the expected structure
      const transformedData = {
        ...data,
        // Map projects to match the expected structure
        projects: data.projects?.map(project => ({
          ...project,
          image: project.image || null,
          title: project.title || '',
          description: project.description || '',
          year: project.year || new Date().getFullYear()
        })) || [],

        // Map certifications to match the expected structure
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
          phone: data.phone || null,
          website: data.website || null
        },

        // Map track record
        trackRecord: {
          yearsOfExperience: new Date().getFullYear() - parseInt(data.established || new Date().getFullYear()),
          notableProjects: data.projects?.map(project => ({
            image: project.image || null,
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

      setCompany(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching company:', err);
      setError('Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

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
    if (id) {
      fetchCompany();
    }
  }, [id]);

  const handleReviewAdded = () => {
    fetchCompany(); // Refresh company data to get the updated reviews
  };

  if (loading) {
    return (
      <div className="flex">
        <ClientNavbar />
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarMinimized ? 'ml-20' : 'ml-80'
        } p-4`}>
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-yellow-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex">
        <ClientNavbar />
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarMinimized ? 'ml-20' : 'ml-80'
        } p-4`}>
          <div>{error || 'Company not found.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <ClientNavbar />
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarMinimized ? 'ml-20' : 'ml-80'
      }`}>
        <div className="container mx-auto p-4">
          <CompanyProfile company={company} onReviewAdded={handleReviewAdded} />
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;