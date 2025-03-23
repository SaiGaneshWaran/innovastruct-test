package com.example.backend.service;

import com.example.backend.dto.PortfolioDTO;
import com.example.backend.model.Company;
import com.example.backend.model.Project;
import com.example.backend.model.Certification;
import com.example.backend.model.Image;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ImageRepository imageRepository;

    public Company createPortfolio(PortfolioDTO portfolioDTO, MultipartFile profileIcon, MultipartFile coverImage, List<MultipartFile> projectImageFiles, List<MultipartFile> certificateImages) throws IOException {
        // Find the company
        Optional<Company> companyOptional = companyRepository.findById(portfolioDTO.getCompanyId());
        if (!companyOptional.isPresent()) {
            throw new RuntimeException("Company not found with ID: " + portfolioDTO.getCompanyId());
        }

        Company company = companyOptional.get();

        // Update basic company information
        company.setName(portfolioDTO.getCompanyName());
        company.setLicense(portfolioDTO.getLicenseNumber());
        company.setShortDescription(portfolioDTO.getShortDescription());
        company.setEstablished(portfolioDTO.getEstablishedYear());
        company.setLocation(portfolioDTO.getLocation());
        company.setEmployees(portfolioDTO.getEmployeeCount());
        company.setServices(portfolioDTO.getServices());
        company.setCidaGrading(portfolioDTO.getCidaGrading());
        company.setEngineerCapacity(portfolioDTO.getEngineerCapacity());

        // Handle profile and cover images
        if (profileIcon != null) {
            Image profileImage = new Image();
            profileImage.setName(profileIcon.getOriginalFilename());
            profileImage.setContentType(profileIcon.getContentType());
            profileImage.setData(profileIcon.getBytes());
            profileImage.setEntityType("company");
            profileImage.setEntityId(company.getId());
            profileImage = imageRepository.save(profileImage);
            company.setProfileIcon(profileImage.getId());
        }

        if (coverImage != null) {
            Image coverImg = new Image();
            coverImg.setName(coverImage.getOriginalFilename());
            coverImg.setContentType(coverImage.getContentType());
            coverImg.setData(coverImage.getBytes());
            coverImg.setEntityType("company");
            coverImg.setEntityId(company.getId());
            coverImg = imageRepository.save(coverImg);
            company.setCoverImage(coverImg.getId());
        }

        // Save company first to ensure it has an ID
        company = companyRepository.save(company);

        // Delete existing projects and their images if editing
        if (company.getProjects() != null) {
            for (Project project : company.getProjects()) {
                imageRepository.deleteByEntityTypeAndEntityId("project", project.getId());
            }
        }
        projectRepository.deleteByCompanyId(company.getId());

        // Handle projects
        List<Project> projects = new ArrayList<>();
        int projectImageIndex = 0;
        for (PortfolioDTO.ProjectDTO projectDTO : portfolioDTO.getProjects()) {
            Project project = new Project();
            project.setTitle(projectDTO.getName());
            project.setDescription(projectDTO.getDescription());
            project.setYear(Integer.parseInt(projectDTO.getCompletionYear()));
            project.setCompany(company);

            // Initialize image IDs list
            List<String> imageIds = new ArrayList<>();
            project.setImageIds(imageIds);

            // Save project first to get its ID
            project = projectRepository.save(project);

            // Handle project images
            if (projectImageIndex < projectImageFiles.size()) {
                MultipartFile imageFile = projectImageFiles.get(projectImageIndex);

                // Create and save image
                Image image = new Image();
                image.setName(imageFile.getOriginalFilename());
                image.setContentType(imageFile.getContentType());
                image.setData(imageFile.getBytes());
                image.setEntityType("project");
                image.setEntityId(project.getId());

                image = imageRepository.save(image);
                imageIds.add(image.getId());
                projectImageIndex++;
            }

            // Update project with image IDs
            project = projectRepository.save(project);
            projects.add(project);
        }
        company.setProjects(projects);

        // Delete existing certifications and their images if editing
        if (company.getCertifications() != null) {
            for (Certification cert : company.getCertifications()) {
                imageRepository.deleteByEntityTypeAndEntityId("certification", cert.getId());
            }
        }
        certificationRepository.deleteByCompanyId(company.getId());

        // Handle certifications
        if (portfolioDTO.getCertifications() != null) {
            List<Certification> certifications = new ArrayList<>();
            int certImageIndex = 0;
            for (PortfolioDTO.CertificationDTO certDTO : portfolioDTO.getCertifications()) {
                Certification certification = new Certification();
                certification.setName(certDTO.getName());
                certification.setOrganization(certDTO.getOrganization());
                certification.setIssueDate(certDTO.getIssueDate());
                certification.setExpiryDate(certDTO.getExpiryDate());
                certification.setCompany(company);

                // Save certification first to get its ID
                certification = certificationRepository.save(certification);

                // Handle certificate image
                if (certImageIndex < certificateImages.size()) {
                    MultipartFile imageFile = certificateImages.get(certImageIndex);

                    // Create and save image
                    Image image = new Image();
                    image.setName(imageFile.getOriginalFilename());
                    image.setContentType(imageFile.getContentType());
                    image.setData(imageFile.getBytes());
                    image.setEntityType("certification");
                    image.setEntityId(certification.getId());

                    image = imageRepository.save(image);
                    certification.setImageId(image.getId());
                    certImageIndex++;
                }

                // Update certification with image ID
                certification = certificationRepository.save(certification);
                certifications.add(certification);
            }
            company.setCertifications(certifications);
        }

        // Handle contact information
        if (portfolioDTO.getContactInformation() != null) {
            company.setEmail(portfolioDTO.getContactInformation().get("email"));
            company.setPhoneNumber(portfolioDTO.getContactInformation().get("phoneNumber"));
            company.setWebsite(portfolioDTO.getContactInformation().get("website"));
        }

        // Handle financial information
        company.setAnnualRevenue(portfolioDTO.getAnnualRevenue());
        company.setFundingSources(portfolioDTO.getFundingSources());

        // Update timestamps
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        company.setUpdatedAt(LocalDateTime.now().format(formatter));
        if (company.getCreatedAt() == null) {
            company.setCreatedAt(LocalDateTime.now().format(formatter));
        }

        // Save the final updated company
        return companyRepository.save(company);
    }
}