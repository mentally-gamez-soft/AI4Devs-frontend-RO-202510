import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import {
  getPositionInterviewFlow,
  getCandidatesByPosition,
  InterviewStep,
  Candidate,
} from '../services/positionService';
import KanbanBoard from '../components/KanbanBoard';
import './PositionDetails.css';

const PositionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [positionName, setPositionName] = useState<string>('');
  const [stages, setStages] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Position ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const positionId = parseInt(id, 10);

        // Fetch position details and interview flow
        const positionDetails = await getPositionInterviewFlow(positionId);
        setPositionName(positionDetails.positionName);
        setStages(positionDetails.interviewFlow.interviewSteps);

        // Fetch candidates for the position
        const candidatesData = await getCandidatesByPosition(positionId);
        setCandidates(candidatesData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load position details';
        setError(errorMessage);
        console.error('Error fetching position details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBackClick = () => {
    navigate('/positions');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Container className="position-details-container">
        <div className="loading-container">
          <Spinner animation="border" role="status" className="loading-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="loading-text">Loading position details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="position-details-container">
        <Row className="error-container">
          <Col md={8} className="mx-auto">
            <Alert variant="danger" className="error-alert">
              <Alert.Heading>Error Loading Position</Alert.Heading>
              <p>{error}</p>
              <div className="error-actions">
                <Button variant="danger" onClick={handleRetry} className="me-2">
                  Try Again
                </Button>
                <Button variant="secondary" onClick={handleBackClick}>
                  Back to Positions
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="position-details-container">
      {/* Header */}
      <Row className="position-header">
        <Col className="header-content">
          <div className="header-left">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleBackClick}
              className="back-button"
              aria-label="Go back to positions list"
            >
              ← Back
            </Button>
            <h1 className="position-title">{positionName}</h1>
          </div>
        </Col>
      </Row>

      {/* Info Row */}
      <Row className="position-info">
        <Col>
          <div className="info-section">
            <span className="info-label">Total Candidates:</span>
            <span className="info-value">{candidates.length}</span>
          </div>
        </Col>
        <Col>
          <div className="info-section">
            <span className="info-label">Interview Stages:</span>
            <span className="info-value">{stages.length}</span>
          </div>
        </Col>
      </Row>

      {/* Kanban Board */}
      <Row className="kanban-section">
        <Col>
          {candidates.length === 0 ? (
            <Alert variant="info" className="no-candidates-alert">
              <Alert.Heading>No candidates yet</Alert.Heading>
              <p>There are no candidates for this position.</p>
            </Alert>
          ) : (
            <KanbanBoard stages={stages} candidates={candidates} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PositionDetails;
