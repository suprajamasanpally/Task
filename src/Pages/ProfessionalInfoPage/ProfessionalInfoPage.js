import React, { useState, useEffect } from "react";
import "./ProfessionalInfoPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const ProfessionalInfoPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, workflow } = location.state || {};

    // Default page ID for Professional Info Page
    const currentPageId = '3';

    const [employers, setEmployers] = useState([
      {
          company: "",
          startDate: "",
          endDate: "",
          jobTitle: "",
          description: "",
          industry: "",
          domain: "",
          currentStatus: "",
      },
  ]);

  const currentPageIndex = workflow ? workflow.indexOf(currentPageId) : -1;
  useEffect(() => {
    if (!workflow || workflow.length === 0) {
        console.error("No workflow defined. Workflow:", workflow);
        alert("Workflow is not properly configured. Please contact support.");
        return;
    }

    if (currentPageIndex === -1) {
        console.error("Current page is not in the workflow. Workflow:", workflow);
        alert("Page is not part of the defined workflow.");
    }
}, [workflow, currentPageIndex, navigate]);


    const handleAddEmployer = () => {
        setEmployers([
            ...employers,
            {
                company: "",
                startDate: "",
                endDate: "",
                jobTitle: "",
                description: "",
                industry: "",
                domain: "",
                currentStatus: "",
            },
        ]);
    };

    const handleRemoveEmployer = (index) => {
        const newEmployers = employers.filter((_, i) => i !== index);
        setEmployers(newEmployers);
    };

    const handleEmployerChange = (index, field, value) => {
        const newEmployers = employers.map((emp, i) =>
            i === index ? { ...emp, [field]: value } : emp
        );
        setEmployers(newEmployers);
    };

    const handleSave = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3001/professional-info', { email, employers })
            .then(() => {
                const nextPageIndex = currentPageIndex + 1;
                const nextPageId = workflow[nextPageIndex];
                if (nextPageId) {
                    navigate(`/page-${nextPageId}`, { state: { email, workflow } });
                } else {
                    navigate('/thank-you', { state: { email } });
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container">
            <h1>Professional Information</h1>
            <form onSubmit={handleSave}>
                {employers.map((employer, index) => (
                    <div key={index} className="employer-section">
                        <div className="row">
                            <div className="column">
                                <label className="input-label">Company</label>
                                <input
                                    type="text"
                                    placeholder="Company name"
                                    className="input-field"
                                    value={employer.company}
                                    onChange={(e) => handleEmployerChange(index, "company", e.target.value)}
                                />
                            </div>
                            <div className="column">
                                <label className="input-label">Start Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={employer.startDate}
                                    onChange={(e) => handleEmployerChange(index, "startDate", e.target.value)}
                                />
                            </div>
                            <div className="column">
                                <label className="input-label">End Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={employer.endDate}
                                    onChange={(e) => handleEmployerChange(index, "endDate", e.target.value)}
                                />
                            </div>
                            <div className="column">
                                <label className="input-label">Job Title</label>
                                <input
                                    type="text"
                                    placeholder="Job title"
                                    className="input-field"
                                    value={employer.jobTitle}
                                    onChange={(e) => handleEmployerChange(index, "jobTitle", e.target.value)}
                                />
                            </div>
                            <div className="column">
                                <label className="input-label">Description</label>
                                <input
                                    type="text"
                                    placeholder="Job description"
                                    className="input-field"
                                    value={employer.description}
                                    onChange={(e) => handleEmployerChange(index, "description", e.target.value)}
                                />
                            </div>
                            <div className="column">
                                <label className="input-label">Industry</label>
                                <input
                                    type="text"
                                    placeholder="Industry"
                                    className="input-field"
                                    value={employer.industry}
                                    onChange={(e) => handleEmployerChange(index, "industry", e.target.value)}
                                />
                            </div>
                            <div className="column">
                                <label className="input-label">Domain</label>
                                <input
                                    type="text"
                                    placeholder="Domain"
                                    className="input-field"
                                    value={employer.domain}
                                    onChange={(e) => handleEmployerChange(index, "domain", e.target.value)}
                                />
                            </div>
                            <div className="column">
                                <label className="input-label">Current Status</label>
                                <select
                                    className="input-field"
                                    value={employer.currentStatus}
                                    onChange={(e) => handleEmployerChange(index, "currentStatus", e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="Employed">Employed</option>
                                    <option value="Unemployed">Unemployed</option>
                                </select>
                            </div>
                        </div>
                        <button type="button" className="remove-btn" onClick={() => handleRemoveEmployer(index)}>Remove Employer</button>
                    </div>
                ))}
                <button type="button" className="add-btn" onClick={handleAddEmployer}>+ Add Employer</button>
                <div className="btn-container">
                    <button type="submit" className="btn">Save</button>
                </div>
            </form>
        </div>
    );
};

export default ProfessionalInfoPage;
