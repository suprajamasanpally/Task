import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./DocumentUploadPage.css";
import Modal from "../../Components/Modal";
import axios from "axios";

const DocumentUploadPage = () => {
  const [documents, setDocuments] = useState({
    identification: { type: "", file: null },
    birthCertificate: { type: "", file: null },
    addressVerification: { type: "", file: null },
    educationalCredentials: { type: "", file: null },
    resume: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email, workflow } = location.state || {}; 

  // Default page ID for Document Upload Page
  const currentPageId = '4'; 

  // Ensure workflow is provided
  if (!workflow || workflow.length === 0) {
    return <p>No workflow defined.</p>;
  }

  // Determine the index of the current page in the workflow
  const currentPageIndex = workflow.indexOf(currentPageId);

  const handleFileChange = (field, file) => {
    setDocuments({ ...documents, [field]: { ...documents[field], file } });
  };

  const handleTypeChange = (field, type) => {
    setDocuments({ ...documents, [field]: { ...documents[field], type } });
  };

  const handleResumeChange = (file) => {
    setDocuments({ ...documents, resume: file });
  };

  const handleSave = (event) => {
    event.preventDefault();

    const formData = new FormData();
    for (const [key, value] of Object.entries(documents)) {
      if (key === "resume") {
        formData.append(key, value);
      } else {
        formData.append(`${key}[type]`, value.type);
        if (value.file) {
          formData.append(`${key}[file]`, value.file);
        }
      }
    }

    axios
      .post("http://localhost:3001/documents-upload", formData)
      .then(() => {
        setModalMessage("Documents uploaded successfully");
        setIsModalOpen(true);
        setTimeout(() => {
          // Determine the index of the next page in the workflow
          const nextPageIndex = currentPageIndex + 1;
          const nextPageId = workflow[nextPageIndex];
          
          // Navigate to the next page or to the thank you page if it's the end of the workflow
          if (nextPageId) {
            navigate(`/page-${nextPageId}`, { state: { email, workflow } });
          } else {
            navigate('/thankyou-page', { state: { email } });
          }
        }, 3000);
      })
      .catch((err) => {
        console.log("Error uploading documents:", err);
        setModalMessage("Error uploading documents");
        setIsModalOpen(true);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <h1>Document Upload</h1>
      <form onSubmit={handleSave}>
        <div className="row">
          <div className="column">
            <label className="input-label">Identification Documents</label>
            <select
              className="input-field"
              value={documents.identification.type}
              onChange={(e) =>
                handleTypeChange("identification", e.target.value)
              }
            >
              <option value="">Select type</option>
              <option value="pancard">PAN Card</option>
              <option value="passport">Passport</option>
              <option value="driversLicense">Driver's License</option>
            </select>
            <input
              type="file"
              className="input-field"
              onChange={(e) =>
                handleFileChange("identification", e.target.files[0])
              }
            />
          </div>
          <div className="column">
            <label className="input-label">Proof of Age</label>
            <select
              className="input-field"
              value={documents.birthCertificate.type}
              onChange={(e) =>
                handleTypeChange("birthCertificate", e.target.value)
              }
            >
              <option value="">Select type</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="birthCertificate">Birth Certificate</option>
            </select>
            <input
              type="file"
              className="input-field"
              onChange={(e) =>
                handleFileChange("birthCertificate", e.target.files[0])
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label className="input-label">
              Address Verification Documents
            </label>
            <select
              className="input-field"
              value={documents.addressVerification.type}
              onChange={(e) =>
                handleTypeChange("addressVerification", e.target.value)
              }
            >
              <option value="">Select type</option>
              <option value="utilityBills">Utility Bills</option>
              <option value="bankStatements">Bank Statements</option>
            </select>
            <input
              type="file"
              className="input-field"
              onChange={(e) =>
                handleFileChange("addressVerification", e.target.files[0])
              }
            />
          </div>
          <div className="column">
            <label className="input-label">Educational Credentials</label>
            <select
              className="input-field"
              value={documents.educationalCredentials.type}
              onChange={(e) =>
                handleTypeChange("educationalCredentials", e.target.value)
              }
            >
              <option value="">Select type</option>
              <option value="academicTranscripts">Academic Transcripts</option>
              <option value="diplomas">Diplomas</option>
            </select>
            <input
              type="file"
              className="input-field"
              onChange={(e) =>
                handleFileChange("educationalCredentials", e.target.files[0])
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label className="input-label">Resume</label>
            <input
              type="file"
              className="input-field"
              onChange={(e) => handleResumeChange(e.target.files[0])}
            />
          </div>
        </div>
        <div className="btn-container">
          <button type="submit" className="btn">
            Save
          </button>
        </div>
      </form>
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
};

export default DocumentUploadPage;
