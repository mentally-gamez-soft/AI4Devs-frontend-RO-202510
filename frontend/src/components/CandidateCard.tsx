import React from 'react';
import { Card } from 'react-bootstrap';
import './CandidateCard.css';

interface CandidateCardProps {
  candidateName: string;
  score: number | null;
  candidateId: number;
  onClick?: () => void;
  isDragging?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidateName,
  score,
  candidateId,
  onClick,
  isDragging,
}) => {
  const formatScore = (scoreValue: number | null | undefined): string => {
    if (scoreValue === null || scoreValue === undefined) {
      return 'N/A';
    }
    return scoreValue.toFixed(1);
  };

  const getScoreColor = (scoreValue: number | null | undefined): string => {
    if (scoreValue === null || scoreValue === undefined) {
      return 'score-na';
    }
    if (scoreValue <= 2) {
      return 'score-low';
    } else if (scoreValue <= 4) {
      return 'score-medium';
    } else {
      return 'score-high';
    }
  };

  return (
    <Card
      className={`candidate-card ${isDragging ? 'dragging' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <Card.Body className="candidate-card-body">
        <Card.Title className="candidate-name">{candidateName}</Card.Title>
        <div className="candidate-score-container">
          <span className="score-label">Score: </span>
          <span className={`candidate-score ${getScoreColor(score)}`}>
            {formatScore(score)}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CandidateCard;
