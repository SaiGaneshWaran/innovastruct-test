import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyNavbar from '../../components/CompanyNavbar';
import CreatePortfolioForm from './CreatePortfolioForm';
import companyService from '../../services/companyService';

const CompanyPortfolioEdit = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
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

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyData = await companyService.getCompanyById(id);

        // Transform the data to match the form structure
        const transformedData = {
          companyName: companyData.name,
          licenseNumber: companyData.license,
          shortDescription: companyData.shortDescription,
          establishedYear: companyData.established,
          location: companyData.location,
          employeeCount: companyData.employees,
          cidaGrading: companyData.cidaGrading || "",
          engineerCapacity: companyData.engineerCapacity || "",
          services: companyData.services || [],
          profileIcon: companyData.profileIcon || null,
          coverImage: companyData.coverImage || null,
          projects: companyData.projects?.map(project => ({
            name: project.title || "",
            description: project.description || "",
            completionYear: project.year ? project.year.toString() : "",
            images: project.imageIds || []
          })) || [{
            name: "",
            description: "",
            completionYear: "",
            images: []
          }],
          annualRevenue: companyData.annualRevenue || "",
          fundingSources: companyData.fundingSources || "",
          certifications: companyData.certifications?.map(cert => ({
            name: cert.name,
            organization: cert.organization,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate,
            image: cert.imageId || null
          })) || [{
            name: "",
            organization: "",
            issueDate: "",
            expiryDate: "",
            image: null
          }],
          email: companyData.email || "",
          phone: companyData.phoneNumber || "",
          website: companyData.website || ""
        };

        setCompany(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

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

  return (
    <div className="flex">
      <CompanyNavbar />
      <div className={`flex-1 transition-all duration-300 ${isSidebarMinimized ? 'ml-20' : 'ml-80'}`}>
        <div className="container mx-auto p-4">
          <CreatePortfolioForm
            initialData={company}
            isEditing={true}
            onCancel={() => navigate(`/company/portfolio/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyPortfolioEdit;