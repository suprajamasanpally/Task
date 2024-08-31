import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TemplateManagement.css';

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/templates')
      .then(response => setTemplates(response.data))
      .catch(error => console.error('Error fetching templates:', error));
  }, []);

  const handleSelectTemplate = (id) => {
    setSelectedTemplateId(id);
  };

  const handleSubmit = () => {
    axios.post('http://localhost:3001/api/templates/select', { templateId: selectedTemplateId })
      .then(() => alert('Template selected successfully'))
      .catch(error => console.error('Error selecting template:', error));
  };

  return (
    <div className="template-management">
      <h2>Template Management</h2>
      <div className="template-list">
        {templates.map(template => (
          <div
            key={template._id}
            className={`template-item ${template._id === selectedTemplateId ? 'selected' : ''}`}
            onClick={() => handleSelectTemplate(template._id)}
          >
            <h3>{template.name}</h3>
            <p>{template.description}</p>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={!selectedTemplateId}>
        Done
      </button>
    </div>
  );
};

export default TemplateManagement;
