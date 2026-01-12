import React, { useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { InterviewStep, Candidate } from '../services/positionService';
import CandidateCard from './CandidateCard';
import './KanbanBoard.css';

interface KanbanBoardProps {
  stages: InterviewStep[];
  candidates: Candidate[];
  onCardClick?: (candidateId: number) => void;
  onDragEnd?: (result: any) => void;
  minScore?: number;
  maxScore?: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  stages,
  candidates,
  onCardClick,
  minScore,
  maxScore,
}) => {
  // Sort stages by orderIndex
  const sortedStages = useMemo(() => {
    return [...stages].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [stages]);

  // Filter candidates based on score range
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const score = candidate.averageScore;
      if (minScore !== undefined && score < minScore) return false;
      if (maxScore !== undefined && score > maxScore) return false;
      return true;
    });
  }, [candidates, minScore, maxScore]);

  // Get candidates for a specific stage
  const getCandidatesForStage = (stageName: string): Candidate[] => {
    return filteredCandidates.filter((candidate) => candidate.currentInterviewStep === stageName);
  };

  // Get total count of candidates for a stage (before filtering)
  const getTotalCandidatesForStage = (stageName: string): number => {
    return candidates.filter((candidate) => candidate.currentInterviewStep === stageName).length;
  };

  return (
    <Container fluid className="kanban-board">
      <Row className="kanban-row">
        {sortedStages.map((stage) => {
          const stageCandidates = getCandidatesForStage(stage.name);
          const totalCandidates = getTotalCandidatesForStage(stage.name);
          const filteredCount = stageCandidates.length;
          const showFilteredCount = (minScore !== undefined || maxScore !== undefined) && filteredCount !== totalCandidates;

          return (
            <Col key={stage.id} className="kanban-column">
              <div className="stage-column">
                <div className="stage-header">
                  <h5 className="stage-title">{stage.name}</h5>
                  <span className="stage-count">
                    {showFilteredCount ? `${filteredCount}/${totalCandidates}` : totalCandidates}
                  </span>
                </div>
                <div className="stage-content">
                  {stageCandidates.length === 0 ? (
                    <div className="empty-state">
                      <p>No candidates</p>
                    </div>
                  ) : (
                    <div className="candidates-list">
                      {stageCandidates.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidateName={candidate.fullName}
                          score={candidate.averageScore}
                          candidateId={candidate.id}
                          onClick={() => onCardClick?.(candidate.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default KanbanBoard;
