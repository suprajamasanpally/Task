import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserAdminDashboard.css";

const UserAdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};  // Get email from state
  const [workflow, setWorkflow] = useState([]);  // Store workflow
  const [selectedTemplate, setSelectedTemplate] = useState(null);  // Store selected template

  // Fetch the workflow on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/workflow")
      .then((response) => {
        if (response.data && response.data.order) {
          console.log("Fetched workflow:", response.data.order);
          setWorkflow(response.data.order);
        } else {
          console.warn("No workflow data returned.");
        }
      })
      .catch((error) => console.error("Error fetching workflow:", error));
  }, []);

  // Fetch the selected template on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/templates/selected")
      .then((response) => {
        if (response.data && response.data.template) {
          setSelectedTemplate(response.data.template);
          console.log("Selected template:", response.data.template);
        } else {
          console.warn("No template data returned.");
        }
      })
      .catch((error) =>
        console.error("Error fetching selected template:", error)
      );
  }, []);

  // Function to handle navigation based on page ID
  const handlePageNavigation = (pageId) => {
    switch (pageId) {
      case "1":
        navigate("/personal-info", { state: { email, workflow } });
        break;
      case "2":
        navigate("/educational-info", { state: { email, workflow } });
        break;
      case "3":
        navigate("/professional-info", { state: { email, workflow } });
        break;
      case "4":
        navigate("/documents-upload", { state: { email, workflow } });
        break;
      default:
        console.error("Unknown page ID:", pageId);
    }
  };

  // Function to start the workflow process
  const handleFillDetails = () => {
    if (workflow.length > 0) {
      handlePageNavigation(workflow[0]);  // Navigate to the first page in the workflow
    } else {
      console.error("No workflow defined. Cannot proceed.");
    }
  };

  return (
    <div className="userpage">
      <h1>Hello {email}, Welcome to the Home!</h1>
      {selectedTemplate && <h2>Selected Template: {selectedTemplate}</h2>}
      <button onClick={handleFillDetails} className="btn">
        Fill in Details
      </button>
      <div className="workflow-buttons">
        {workflow.length > 0 ? (
          <p>Workflow order: {workflow.join(" -> ")}</p>
        ) : (
          <p>No workflow defined.</p>
        )}
      </div>
    </div>
  );
};

export default UserAdminDashboard;
