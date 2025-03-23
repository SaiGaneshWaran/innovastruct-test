import { useState } from "react";
import { ArrowLeft, Upload, Plus, Trash2, FileText } from "lucide-react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";

const CreatePortfolioForm = ({ onCancel, initialData, isEditing }) => {
  const navigate = useNavigate();

  const getImageUrl = (imageId) => {
    if (!imageId) return null;
    return `http://localhost:8080/api/images/${imageId}`;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState(initialData || {
    companyName: "",
    licenseNumber: "",
    shortDescription: "",
    establishedYear: "",
    location: "",
    employeeCount: "",
    services: [],
    profileIcon: null,
    coverImage: null,
    projects: [
      {
        name: "",
        description: "",
        completionYear: "",
        images: [],
      },
    ],
    annualRevenue: "",
    fundingSources: "",
    certifications: [
      {
        name: "",
        organization: "",
        issueDate: "",
        expiryDate: "",
        image: null,
      },
    ],
    email: "",
    phone: "",
    website: "",
  });

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1: // Company Details
        if (!formData.companyName.trim()) return "Company name is required";
        if (!formData.licenseNumber.trim()) return "License number is required";
        if (!formData.shortDescription.trim()) return "Description is required";
        if (!formData.cidaGrading) return "CIDA grading is required";
        if (!formData.engineerCapacity) return "Engineer capacity is required";
        if (!formData.establishedYear) return "Established year is required";
        if (!formData.employeeCount) return "Employee count is required";
        return null;

      case 2: // Services
        if (formData.services.length === 0)
          return "Please select at least one service";
        return null;

      case 3: // Projects
        const invalidProject = formData.projects.find(
          (project) =>
            !project.name.trim() ||
            !project.description.trim() ||
            !project.completionYear
        );
        if (invalidProject) return "Please complete all project details";
        return null;

      case 4: // Financial Info
        // Optional step - no validation required
        return null;

      case 5: // Certifications
        const invalidCert = formData.certifications.find(
          (cert) =>
            !cert.name.trim() || !cert.organization.trim() || !cert.issueDate
        );
        if (invalidCert) return "Please complete all certification details";
        return null;

      case 6: // Contact Info
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) return "Email is required";
        if (!emailRegex.test(formData.email))
          return "Please enter a valid email";
        if (!formData.phone.trim()) return "Phone number is required";
        return null;

      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: "Company Details" },
    { number: 2, title: "Services" },
    { number: 3, title: "Past Projects" },
    { number: 4, title: "Financial Info" },
    { number: 5, title: "Certifications" },
    { number: 6, title: "Contact Info" },
  ];

  const serviceOptions = [
    "Residential Construction",
    "Commercial Construction",
    "Industrial Construction",
    "Renovation",
    "Interior Design",
    "Architectural Services",
    "Project Management",
    "Civil Engineering",
    "MEP Services",
    "Landscaping",
  ];

  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: "",
          description: "",
          completionYear: "",
          images: [],
        },
      ],
    }));
  };
  const handleCertificateImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size should be less than 10MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.map((cert, i) =>
          i === index ? { ...cert, image: file } : cert
        ),
      }));
    }
  };
  const handleRemoveCertificateImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, image: null } : cert
      ),
    }));
  };
  const handleRemoveProject = (index) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleAddCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: "",
          organization: "",
          issueDate: "",
          expiryDate: "",
          image: null,
        },
      ],
    }));
  };

  const handleRemoveCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e, projectIndex) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              images: [...project.images, ...files],
              newImages: [...(project.newImages || []), ...files],
            }
          : project
      ),
    }));
  };

  const handleRemoveImage = (projectIndex, imageIndex) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === projectIndex
          ? {
              ...project,
              images: project.images.filter((_, idx) => idx !== imageIndex),
            }
          : project
      ),
    }));
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleImageRemove = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return renderCompanyDetails();
      case 2:
        return renderServices();
      case 3:
        return renderProjects();
      case 4:
        return renderFinancial();
      case 5:
        return renderCertifications();
      case 6:
        return renderContact();
      default:
        return null;
    }
  };

  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Image
              <span className="ml-1 text-gray-400">(Recommended size: 1200x400px)</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-yellow-500 transition-colors">
              <div className="space-y-1 text-center">
                {typeof formData.coverImage === 'string' ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(formData.coverImage)}
                      alt="Cover preview"
                      className="mx-auto h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove('coverImage')}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : formData.coverImage ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.coverImage)}
                      alt="Cover preview"
                      className="mx-auto h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove('coverImage')}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="cover-image" className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500">
                        <span>Upload a cover image</span>
                        <input
                          id="cover-image"
                          name="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'coverImage')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
              <span className="ml-1 text-gray-400">(Recommended size: 400x400px)</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-yellow-500 transition-colors">
              <div className="space-y-1 text-center">
                {typeof formData.profileIcon === 'string' ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(formData.profileIcon)}
                      alt="Profile preview"
                      className="mx-auto h-32 w-32 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove('profileIcon')}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : formData.profileIcon ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.profileIcon)}
                      alt="Profile preview"
                      className="mx-auto h-32 w-32 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove('profileIcon')}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="profile-image" className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500">
                        <span>Upload a profile image</span>
                        <input
                          id="profile-image"
                          name="profileIcon"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'profileIcon')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            License Number
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            CIDA Grading
          </label>
          <select
            name="cidaGrading"
            value={formData.cidaGrading}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
            required
          >
            <option value="">Select CIDA Grade</option>
            <option value="CS1">CS1</option>
            <option value="CS2">CS2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
            <option value="C3">C3</option>
            <option value="C4">C4</option>
            <option value="C5">C5</option>
            <option value="C6">C6</option>
            <option value="C7">C7</option>
            <option value="C8">C8</option>
            <option value="C9">C9</option>
            <option value="C10">C10</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Engineer Capacity
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="engineerCapacity"
              value={formData.engineerCapacity}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
              required
            />
            <span className="text-sm text-gray-500 mt-1">engineers</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Established Year
          </label>
          <input
            type="number"
            name="establishedYear"
            value={formData.establishedYear}
            onChange={handleInputChange}
            min="1900"
            max={new Date().getFullYear()}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="City, Country"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Employees
          </label>
          <input
            type="number"
            name="employeeCount"
            value={formData.employeeCount}
            onChange={handleInputChange}
            min="1"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Select Services</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {serviceOptions.map((service) => (
          <div
            key={service}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              formData.services.includes(service)
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200 hover:border-yellow-300"
            }`}
            onClick={() => handleServiceToggle(service)}
          >
            <p className="text-sm font-medium">{service}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      {formData.projects.map((project, index) => (
        <div key={index} className="p-6 bg-gray-50 rounded-lg relative">
          {index > 0 && (
            <button
              type="button"
              onClick={() => handleRemoveProject(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                value={project.name}
                onChange={(e) => handleInputChange(e, "projects", index)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Completion Year
              </label>
              <input
                type="number"
                name="completionYear"
                value={project.completionYear}
                onChange={(e) => handleInputChange(e, "projects", index)}
                min="1900"
                max={new Date().getFullYear()}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                name="description"
                value={project.description}
                onChange={(e) => handleInputChange(e, "projects", index)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Images
                <span className="ml-1 text-gray-400">(Max 5 images)</span>
              </label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.images.map((image, imageIndex) => (
                  <div key={imageIndex} className="relative">
                    {typeof image === 'string' ? (
                      <>
                        <img
                          src={getImageUrl(image)}
                          alt={`Project ${index + 1} preview ${imageIndex + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index, imageIndex)}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Project ${index + 1} preview ${imageIndex + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index, imageIndex)}
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {project.images.length < 5 && (
                  <div>
                    <label className="block h-24 w-full cursor-pointer border-2 border-gray-300 border-dashed rounded-md hover:border-yellow-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, index)}
                        className="sr-only"
                      />
                      <div className="h-full flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="mt-1 text-xs text-gray-500">Add Image</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddProject}
        className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
      >
        <Plus className="w-5 h-5" />
        Add Another Project
      </button>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Annual Revenue Range
          <span className="ml-1 text-gray-400">(Optional)</span>
        </label>
        <select
          name="annualRevenue"
          value={formData.annualRevenue}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
        >
          <option value="">Select Range</option>
          <option value="< 1M">Less than $1M</option>
          <option value="1M-5M">$1M - $5M</option>
          <option value="5M-10M">$5M - $10M</option>
          <option value="10M-50M">$10M - $50M</option>
          <option value="> 50M">More than $50M</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Funding Sources
          <span className="ml-1 text-gray-400">(Optional)</span>
        </label>
        <textarea
          name="fundingSources"
          value={formData.fundingSources}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
          placeholder="List your major funding sources or investors..."
        />
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-8">
      {formData.certifications.map((cert, index) => (
        <div key={index} className="p-6 bg-gray-50 rounded-lg relative">
          {index > 0 && (
            <button
              type="button"
              onClick={() => handleRemoveCertification(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Certification Name
              </label>
              <input
                type="text"
                name="name"
                value={cert.name}
                onChange={(e) => handleInputChange(e, "certifications", index)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issuing Organization
              </label>
              <input
                type="text"
                name="organization"
                value={cert.organization}
                onChange={(e) => handleInputChange(e, "certifications", index)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={cert.issueDate}
                onChange={(e) => handleInputChange(e, "certifications", index)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
                <span className="ml-1 text-gray-400">(Optional)</span>
              </label>
              <input
                type="date"
                name="expiryDate"
                value={cert.expiryDate}
                onChange={(e) => handleInputChange(e, "certifications", index)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Certificate Image
                <span className="ml-1 text-gray-400">(PDF, JPG, PNG)</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-yellow-500 transition-colors">
                <div className="space-y-1 text-center">
                  {typeof cert.image === 'string' ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(cert.image)}
                        alt={`Certificate ${index + 1}`}
                        className="mx-auto h-32 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificateImage(index)}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : cert.image ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(cert.image)}
                        alt={`Certificate ${index + 1}`}
                        className="mx-auto h-32 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCertificateImage(index)}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor={`certificate-${index}`}
                          className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id={`certificate-${index}`}
                            type="file"
                            name="certificateImage"
                            onChange={(e) => handleCertificateImageChange(e, index)}
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddCertification}
        className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
      >
        <Plus className="w-5 h-5" />
        Add Another Certification
      </button>
    </div>
  );

  const renderContact = () => {
    console.log("Contact form data:", {
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
    });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website
              <span className="ml-1 text-gray-400">(Optional)</span>
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-yellow-500"
              placeholder="https://"
            />
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();

      // Add profile and cover images if they exist
      if (formData.profileIcon instanceof File) {
        formDataObj.append("profileIcon", formData.profileIcon);
      }
      if (formData.coverImage instanceof File) {
        formDataObj.append("coverImage", formData.coverImage);
      }

      formData.projects.forEach((project) => {
        project.images.forEach((image) => {
          if (image instanceof File) {
            formDataObj.append("projectImages", image);
          }
        });
      });

      formData.certifications.forEach((cert) => {
        if (cert.image && cert.image instanceof File) {
          formDataObj.append("certificateImages", cert.image);
        }
      });

      const currentUser = userService.getCurrentUser();
      if (!currentUser) {
        throw new Error("No logged-in user found");
      }

      const completeUserData = await userService.getUserById(currentUser.id);
      if (!completeUserData || !completeUserData.companyId) {
        throw new Error("No company ID found for the logged-in user");
      }

      const cleanFormData = {
        ...formData,
        companyId: completeUserData.companyId,
        contactInformation: {
          email: formData.email,
          phoneNumber: formData.phone,
          website: formData.website,
        },
        projects: formData.projects.map((project) => ({
          ...project,
          images: project.images.map(image =>
            typeof image === 'string' ? image : 'placeholder'
          ),
        })),
        certifications: formData.certifications.map((cert) => ({
          ...cert,
          image: cert.image instanceof File ? null : cert.image,
        })),
        profileIcon: formData.profileIcon instanceof File ? null : formData.profileIcon,
        coverImage: formData.coverImage instanceof File ? null : formData.coverImage,
      };

      delete cleanFormData.email;
      delete cleanFormData.phone;
      delete cleanFormData.website;

      formDataObj.append("companyData", JSON.stringify(cleanFormData));

      const endpoint = isEditing
        ? `http://localhost:8080/api/companies/portfolio/${completeUserData.companyId}`
        : "http://localhost:8080/api/companies/portfolio";

      const method = isEditing ? "PUT" : "POST";

      const response = await axios({
        method,
        url: endpoint,
        data: formDataObj,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === (isEditing ? 200 : 201)) {
        const updatedCompany = response.data;
        navigate(`/company/portfolio/${updatedCompany.id}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error ${isEditing ? "updating" : "creating"} company portfolio: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    const error = validateStep(activeStep);
    if (error) {
      alert(error);
      return;
    }

    if (activeStep === steps.length) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={onCancel}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit" : "Create"} Company Portfolio
        </h1>
      </div>

      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col items-center ${
                step.number === activeStep ? "text-yellow-500" : "text-gray-400"
              } ${isEditing ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (isEditing) {
                  setActiveStep(step.number);
                }
              }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step.number === activeStep
                    ? "border-yellow-500 bg-yellow-50"
                    : isEditing ? "border-gray-300 hover:border-yellow-300" : "border-gray-300"
                }`}
              >
                {step.number}
              </div>
              <span className="text-sm mt-1">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {renderStep()}

        <div className="flex justify-between pt-8 border-t">
          {!isEditing && (
            <>
              <button
                type="button"
                onClick={() => setActiveStep((prev) => prev - 1)}
                className={`px-4 py-2 text-gray-600 hover:text-gray-800 ${
                  activeStep === 1 ? "invisible" : ""
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleNextStep}
                className={`bg-yellow-500 text-white px-6 py-2 rounded-md transition-colors
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"}`}
              >
                {activeStep === steps.length
                  ? isSubmitting
                    ? "Submitting..."
                    : "Submit"
                  : "Next"}
              </button>
            </>
          )}
          {isEditing && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`bg-yellow-500 text-white px-6 py-2 rounded-md transition-colors ml-auto
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"}`}
            >
              {isSubmitting ? "Updating..." : "Update Portfolio"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

CreatePortfolioForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isEditing: PropTypes.bool.isRequired,
};

export default CreatePortfolioForm;
