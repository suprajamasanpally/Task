import React, { useState, useEffect } from 'react';
import './EducationalInfoPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EducationalInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, workflow } = location.state || {};

  // Default page ID for Educational Info Page
  const currentPageId = '2';

  const [educationalInfo, setEducationalInfo] = useState({
    highestQualification: '',
    course: '',
    fieldOfStudy: '',
    university: '',
    gpa: '',
    completionDate: '',
    certifications: [{ name: '', date: '' }]
  });

  useEffect(() => {
    if (!workflow || workflow.length === 0) {
      console.error("No workflow defined.");
      navigate('/error'); // Redirect to error page if workflow is not defined
    }
  }, [workflow, navigate]);

  // Determine the index of the current page in the workflow
  const currentPageIndex = workflow ? workflow.indexOf(currentPageId) : -1;

  useEffect(() => {
    if (currentPageIndex === -1) {
      console.error("Current page is not in the workflow.");
      navigate('/error'); // Redirect to error page if current page is not in the workflow
    }
  }, [currentPageIndex, navigate]);

  const handleInputChange = (field, value) => {
    setEducationalInfo({ ...educationalInfo, [field]: value });
  };

  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = educationalInfo.certifications.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert
    );
    setEducationalInfo({ ...educationalInfo, certifications: updatedCertifications });
  };

  const handleAddCertification = () => {
    setEducationalInfo({
      ...educationalInfo,
      certifications: [...educationalInfo.certifications, { name: '', date: '' }]
    });
  };

  const handleRemoveCertification = (index) => {
    const updatedCertifications = educationalInfo.certifications.filter((_, i) => i !== index);
    setEducationalInfo({ ...educationalInfo, certifications: updatedCertifications });
  };

  const handleSave = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/educational-info', { email, ...educationalInfo })
      .then(() => {
        const nextPageIndex = currentPageIndex + 1;
        const nextPageId = workflow[nextPageIndex];
        if (nextPageId) {
          navigate(`/page-${nextPageId}`, { state: { email, workflow } });
        } else {
          navigate('/thank-you', { state: { email } });
        }
      })
      .catch(err => {
        console.error(err);
        navigate('/error'); // Redirect to error page on save failure
      });
  };

  // Render the component
  return (
    <div className='container'>
      <h1>Educational Information</h1>
      <form onSubmit={handleSave}>
        <div className='row'>
          <div className='column'>
            <label className='input-label'>Highest Qualification</label>
            <select
              className='input-field'
              value={educationalInfo.highestQualification}
              onChange={(e) => handleInputChange('highestQualification', e.target.value)}
            >
              <option value="">Select</option>
              <option value="Doctorate/PhD">Doctorate/PhD</option>
              <option value="Masters/Post-Graduation">Masters/Post-Graduation</option>
              <option value="Graduation/Diploma">Graduation/Diploma</option>
              <option value="12th">12th</option>
              <option value="10th">10th</option>
              <option value="Below 10th">Below 10th</option>
            </select>
          </div>
          <div className='column'>
            <label className='input-label'>Course</label>
            <select
              className='input-field'
              value={educationalInfo.course}
              onChange={(e) => handleInputChange('course', e.target.value)}
            >
              <option value="">Select</option>
              <option value="B.A">B.A</option>
              <option value="BCA">BCA</option>
              <option value="B.B.A/ B.M.S">B.B.A/ B.M.S</option>
              <option value="B.Com">B.Com</option>
              <option value="B.Ed">B.Ed</option>
              <option value="B.Pharma">B.Pharma</option>
              <option value="B.Sc">B.Sc</option>
              <option value="B.Tech/B.E.">B.Tech/B.E.</option>
              <option value="LLB">LLB</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>
          <div className='column'>
            <label className='input-label'>Specialization</label>
            <input
              type='text'
              placeholder='Specialization'
              className='input-field'
              value={educationalInfo.fieldOfStudy}
              onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column full-width'>
            <label className='input-label'>University/Institute</label>
            <input
              type='text'
              placeholder='Eg. National Institute of Technology (NIT)'
              className='input-field'
              value={educationalInfo.university}
              onChange={(e) => handleInputChange('university', e.target.value)}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <label className='input-label'>GPA</label>
            <input
              type='text'
              placeholder='Enter GPA'
              className='input-field'
              value={educationalInfo.gpa}
              onChange={(e) => handleInputChange('gpa', e.target.value)}
            />
          </div>
          <div className='column'>
            <label className='input-label'>Date of Degree Completion</label>
            <input
              type='date'
              className='input-field'
              value={educationalInfo.completionDate}
              onChange={(e) => handleInputChange('completionDate', e.target.value)}
            />
          </div>
        </div>

        {educationalInfo.certifications.map((cert, index) => (
          <div key={index} className='certification-section'>
            <div className='row'>
              <div className='column'>
                <label className='input-label'>Certification Name</label>
                <input
                  type='text'
                  placeholder='Enter certification name'
                  className='input-field'
                  value={cert.name}
                  onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                />
              </div>
              <div className='column'>
                <label className='input-label'>Date of Certification</label>
                <input
                  type='date'
                  className='input-field'
                  value={cert.date}
                  onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                />
              </div>
              <button type='button' className='remove-btn' onClick={() => handleRemoveCertification(index)}>Remove</button>
            </div>
          </div>
        ))}

        <button type='button' className='add-btn' onClick={handleAddCertification}>+ Add Certification</button>

        <div className='btn-container'>
          <button type='submit' className='btn'>Save</button>
        </div>
      </form>
    </div>
  );
};

export default EducationalInfoPage;
