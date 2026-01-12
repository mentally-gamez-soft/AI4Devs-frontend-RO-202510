import React, { useMemo, useState, useCallback } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { InterviewStep, Candidate, updateCandidateStage } from '../services/positionService';
import CandidateCard from './CandidateCard';
import './KanbanBoard.css';

interface KanbanBoardProps {
  stages: InterviewStep[];
  candidates: Candidate[];
  onCardClick?: (candidateId: number) => void;
  onDragEnd?: (result: any) => void;
  onCandidatesUpdate?: (updatedCandidates: Candidate[]) => void;
  minScore?: number;
  maxScore?: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  stages,
  candidates,
  onCardClick,
  onCandidatesUpdate,
  minScore,
  maxScore,
}) => {
  const [localCandidates, setLocalCandidates] = useState<Candidate[]>(candidates);
  const [loadingCandidateId, setLoadingCandidateId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previousState, setPreviousState] = useState<Candidate[] | null>(null);
  // Sync external candidates prop with local state
  React.useEffect(() => {
    setLocalCandidates(candidates);
  }, [candidates]);

  // Sort stages by orderIndex
  const sortedStages = useMemo(() => {
    return [...stages].sort((a, b) => a.orderIndex - b.orderIndex);
  }, [stages]);

  // Filter candidates based on score range
  const filteredCandidates = useMemo(() => {
    return localCandidates.filter((candidate) => {
      const score = candidate.averageScore;
      if (minScore !== undefined && score < minScore) return false;
      if (maxScore !== undefined && score > maxScore) return false;
      return true;
    });
  }, [localCandidates, minScore, maxScore]);

  // Get candidates for a specific stage
  const getCandidatesForStage = (stageName: string): Candidate[] => {
    return filteredCandidates.filter((candidate) => candidate.currentInterviewStep === stageName);
  };

  // Get total count of candidates for a stage (before filtering)
  const getTotalCandidatesForStage = (stageName: string): number => {
    return localCandidates.filter((candidate) => candidate.currentInterviewStep === stageName).length;
  };

  // Handle drag end - update candidate stage
  const handleDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // If no destination or dropped in same place, do nothing
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const candidateId = parseInt(draggableId.split('-')[1], 10);
    const candidate = localCandidates.find((c) => c.id === candidateId);

    if (!candidate) return;

    const newStageName = destination.droppableId;
    const stageIdMap = new Map(stages.map((stage) => [stage.name, stage.id]));
    const newStageId = stageIdMap.get(newStageName);

    if (!newStageId) return;

    // Store previous state for rollback
    setPreviousState([...localCandidates]);
    setLoadingCandidateId(candidateId);
    setError(null);

    // Optimistic update - update UI immediately
    const updatedCandidates = localCandidates.map((c) =>
      c.id === candidateId
        ? { ...c, currentInterviewStep: newStageName }
        : c
    );
    setLocalCandidates(updatedCandidates);
    onCandidatesUpdate?.(updatedCandidates);

    try {
      // Update backend
      await updateCandidateStage(candidateId, candidate.applicationId, newStageId);
      setLoadingCandidateId(null);
    } catch (err) {
      // Rollback on error
      setLocalCandidates(previousState || localCandidates);
      onCandidatesUpdate?.(previousState || localCandidates);
      setLoadingCandidateId(null);
      setError(`Failed to update candidate stage: ${err instanceof Error ? err.message : 'Unknown error'}`);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  }, [localCandidates, previousState, stages, onCandidatesUpdate]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container fluid className="kanban-board">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        <Row className="kanban-row">
          {sortedStages.map((stage) => {
            const stageCandidates = getCandidatesForStage(stage.name);
            const totalCandidates = getTotalCandidatesForStage(stage.name);
            const filteredCount = stageCandidates.length;
            const showFilteredCount = (minScore !== undefined || maxScore !== undefined) && filteredCount !== totalCandidates;

            return (
              <Col key={stage.id} className="kanban-column">
                <div className="stage-column" role="region" aria-label={`${stage.name} stage column`}>
                  <div className="stage-header">
                    <h5 className="stage-title">{stage.name}</h5>
                    <span className="stage-count" aria-label={`${totalCandidates} candidates in ${stage.name}`}>
                      {showFilteredCount ? `${filteredCount}/${totalCandidates}` : totalCandidates}
                    </span>
                  </div>
                  <Droppable droppableId={stage.name} type="CANDIDATE">
                    {(provided, snapshot) => (
                      <div
                        className={`stage-content ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        data-testid={`droppable-${stage.name}`}
                        role="region"
                        aria-label={`Drop zone for ${stage.name} candidates`}
                        aria-dropeffect="move"
                      >
                        {stageCandidates.length === 0 ? (
                          <div className="empty-state">
                            <p>No candidates</p>
                          </div>
                        ) : (
                          <div className="candidates-list">
                            {stageCandidates.map((candidate, index) => (
                              <Draggable
                                key={`candidate-${candidate.id}`}
                                draggableId={`candidate-${candidate.id}`}
                                index={index}
                                isDragDisabled={loadingCandidateId === candidate.id}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`candidate-wrapper ${snapshot.isDragging ? 'dragging' : ''} ${
                                      loadingCandidateId === candidate.id ? 'loading' : ''
                                    }`}
                                    data-testid={`draggable-candidate-${candidate.id}`}
                                  >
                                    <CandidateCard
                                      candidateName={candidate.fullName}
                                      score={candidate.averageScore}
                                      candidateId={candidate.id}
                                      onClick={() => onCardClick?.(candidate.id)}
                                    />
                                    {loadingCandidateId === candidate.id && (
                                      <div className="candidate-loading-overlay">
                                        <Spinner animation="border" size="sm" />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </DragDropContext>
  );
};

export default KanbanBoard;
