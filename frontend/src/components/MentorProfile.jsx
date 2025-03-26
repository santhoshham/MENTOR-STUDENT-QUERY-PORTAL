import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiStarFill, RiMessage3Line, RiCalendarLine } from 'react-icons/ri';
import axios from 'axios';
import '../styles/MentorProfile.css';

function MentorProfile() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/auth/${mentorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentor(response.data);
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError('Failed to load mentor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!mentor) return <div className="error-message">Mentor not found.</div>;

  const handleStartChat = () => {
    console.log('Start chat with mentor:', mentorId);
  };

  const handleScheduleSession = () => {
    console.log('Schedule session with mentor:', mentorId);
  };

  return (
    <div className="mentor-profile">
      <button className="back-button" onClick={() => navigate('/student/mentors')}>
        <RiArrowLeftLine /> Back to Mentors
      </button>
      <div className="profile-content">
        <div className="profile-header">
          <div className="mentor-avatar">
            {mentor.avatar ? (
              <img src={mentor.avatar} alt={mentor.name} />
            ) : (
              <div className="avatar-placeholder">{mentor.name?.charAt(0)}</div>
            )}
          </div>
          <div className="mentor-header-info">
            <h1>{mentor.name}</h1>
            <p className="mentor-title">{mentor.title}</p>
            <div className="mentor-rating">
              <RiStarFill /> {mentor.rating || 0} ({mentor.totalSessions || 0} sessions)
            </div>
          </div>
          <div className="profile-actions">
            <button className="chat-btn" onClick={handleStartChat}>
              <RiMessage3Line /> Start Chat
            </button>
            <button className="schedule-btn" onClick={handleScheduleSession}>
              <RiCalendarLine /> Schedule Session
            </button>
          </div>
        </div>
        <div className="profile-grid">
          <div className="profile-main">
            <section className="about-section">
              <h2>About</h2>
              <p>{mentor.bio || 'No bio available'}</p>
            </section>
            <section className="expertise-section">
              <h2>Expertise</h2>
              <div className="expertise-tags">
                {mentor.expertise?.length > 0 ? (
                  mentor.expertise.map((skill, index) => <span key={index} className="expertise-tag">{skill}</span>)
                ) : (
                  <p>No expertise listed</p>
                )}
              </div>
            </section>
            <section className="education-section">
              <h2>Education</h2>
              <div className="education-list">
                {mentor.education?.length > 0 ? (
                  mentor.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <h3>{edu.degree}</h3>
                      <p>{edu.institution}, {edu.year}</p>
                    </div>
                  ))
                ) : (
                  <p>No education details available</p>
                )}
              </div>
            </section>
            <section className="certifications-section">
              <h2>Certifications</h2>
              <div className="certifications-list">
                {mentor.certifications?.length > 0 ? (
                  mentor.certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                      <span>{cert.name}</span>
                      <span className="cert-year">{cert.year}</span>
                    </div>
                  ))
                ) : (
                  <p>No certifications available</p>
                )}
              </div>
            </section>
            <section className="reviews-section">
              <h2>Student Reviews</h2>
              <div className="reviews-list">
                {mentor.reviews?.length > 0 ? (
                  mentor.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <span className="review-author">{review.student}</span>
                        <div className="review-rating">
                          <RiStarFill /> {review.rating}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet</p>
                )}
              </div>
            </section>
          </div>
          <div className="profile-sidebar">
            <div className="info-card">
              <h3>Quick Info</h3>
              <div className="info-item">
                <span>Experience</span>
                <span>{mentor.experience || 'Not specified'}</span>
              </div>
              <div className="info-item">
                <span>Response Time</span>
                <span>{mentor.responseTime || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span>Languages</span>
                <span>{mentor.languages?.length > 0 ? mentor.languages.join(', ') : 'Not specified'}</span>
              </div>
              <div className="info-item">
                <span>Availability</span>
                <span className={`availability ${mentor.availability?.toLowerCase() || 'unknown'}`}>
                  {mentor.availability || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorProfile;
