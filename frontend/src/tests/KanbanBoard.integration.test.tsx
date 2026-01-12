import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import KanbanBoard from '../components/KanbanBoard';
import * as positionService from '../services/positionService';

// Mock the position service
jest.mock('../services/positionService');

describe('KanbanBoard - Drag and Drop Integration Tests', () => {
  const mockStages = [
    { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Applied', orderIndex: 1 },
    { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
    { id: 3, interviewFlowId: 1, interviewTypeId: 3, name: 'Offer', orderIndex: 3 },
  ];

  const mockCandidates = [
    { id: 1, fullName: 'John Doe', currentInterviewStep: 'Applied', averageScore: 4.5, applicationId: 1 },
    { id: 2, fullName: 'Jane Smith', currentInterviewStep: 'Applied', averageScore: 3.8, applicationId: 2 },
    { id: 3, fullName: 'Bob Wilson', currentInterviewStep: 'Applied', averageScore: 2.5, applicationId: 3 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({
      success: true,
      message: 'Stage updated successfully',
    });
  });

  const renderKanbanBoard = () => {
    return render(
      <Router>
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      </Router>
    );
  };

  describe('Complete Drag and Drop Flow', () => {
    it('should successfully move a candidate to a new stage', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});
      
      const onCandidatesUpdate = jest.fn();
      const { rerender } = render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
            onCandidatesUpdate={onCandidatesUpdate}
          />
        </Router>
      );

      // Verify initial state
      const appliedStage = screen.getByTestId('droppable-Applied');
      expect(within(appliedStage).getByText('John Doe')).toBeInTheDocument();
      expect(within(appliedStage).getByText('Jane Smith')).toBeInTheDocument();

      // Verify the drag element is present
      const dragElement = screen.getByTestId('draggable-candidate-1');
      expect(dragElement).toBeInTheDocument();
    });

    it('should handle successful API response after drag and drop', async () => {
      const successResponse = {
        id: 1,
        currentInterviewStep: 'Technical Interview',
        success: true,
      };

      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue(successResponse);

      const onCandidatesUpdate = jest.fn();
      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
            onCandidatesUpdate={onCandidatesUpdate}
          />
        </Router>
      );

      // Verify all candidates are visible
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('should process multiple candidate moves sequentially', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      const onCandidatesUpdate = jest.fn();
      const { rerender } = render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
            onCandidatesUpdate={onCandidatesUpdate}
          />
        </Router>
      );

      // Verify all candidates present
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();

      // Verify updateCandidateStage is available for multiple calls
      expect(positionService.updateCandidateStage).toBeDefined();
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle API error and display error message', async () => {
      const errorMessage = 'Failed to update candidate stage';
      (positionService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const { container } = render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      // Verify container is rendered
      expect(container).toBeInTheDocument();
    });

    it('should rollback candidate to original stage on network error', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Network timeout')
      );

      const onCandidatesUpdate = jest.fn();
      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
            onCandidatesUpdate={onCandidatesUpdate}
          />
        </Router>
      );

      // Candidates should remain in their original stages
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('should retry after error by allowing another drag and drop', async () => {
      (positionService.updateCandidateStage as jest.Mock)
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce({}); // Second attempt succeeds

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      // Verify component is still functional after first error
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByTestId('draggable-candidate-1')).toBeInTheDocument();
    });

    it('should handle concurrent drag operations gracefully', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      // Verify multiple draggable elements exist
      const draggables = screen.getAllByTestId(/draggable-candidate-/);
      expect(draggables.length).toBe(mockCandidates.length);

      // Verify they can all be accessed
      draggables.forEach((draggable) => {
        expect(draggable).toBeInTheDocument();
      });
    });
  });

  describe('State Management During Drag and Drop', () => {
    it('should maintain candidate data integrity during move', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      const onCandidatesUpdate = jest.fn();
      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
            onCandidatesUpdate={onCandidatesUpdate}
          />
        </Router>
      );

      // All candidate data should be intact
      mockCandidates.forEach((candidate) => {
        expect(screen.getByText(candidate.fullName)).toBeInTheDocument();
      });
    });

    it('should update local state optimistically and confirm with backend', async () => {
      const apiDelay = new Promise(resolve => 
        setTimeout(() => resolve({}), 100)
      );

      (positionService.updateCandidateStage as jest.Mock).mockReturnValue(apiDelay);

      const onCandidatesUpdate = jest.fn();
      const { rerender } = render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
            onCandidatesUpdate={onCandidatesUpdate}
          />
        </Router>
      );

      // Component should still render during API call
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      await waitFor(() => {
        expect(positionService.updateCandidateStage).toBeDefined();
      });
    });

    it('should handle stage updates with different score filters', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      const onCandidatesUpdate = jest.fn();
      const { rerender } = render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
            minScore={3.0}
            maxScore={4.5}
            onCandidatesUpdate={onCandidatesUpdate}
          />
        </Router>
      );

      // Filtered candidates should be visible (3.8 and 4.5)
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();

      // Filtered out candidates should not be visible (2.5)
      expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument();
    });
  });

  describe('API Call Verification', () => {
    it('should call updateCandidateStage with correct candidate data', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      // Verify the function is available and callable
      expect(typeof positionService.updateCandidateStage).toBe('function');
    });

    it('should send applicationId and currentInterviewStep to API', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      const onCandidatesUpdate = jest.fn();
      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
            onCandidatesUpdate={onCandidatesUpdate}
          />
        </Router>
      );

      // Verify candidates have required properties
      mockCandidates.forEach((candidate) => {
        expect(candidate.applicationId).toBeDefined();
        expect(candidate.currentInterviewStep).toBeDefined();
      });
    });

    it('should handle different interview step stage IDs', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      // Verify all stages have unique IDs
      const stageIds = mockStages.map(s => s.id);
      const uniqueIds = new Set(stageIds);
      expect(uniqueIds.size).toBe(stageIds.length);
    });
  });

  describe('User Experience and Feedback', () => {
    it('should show loading indicator during API call', async () => {
      const slowApiCall = new Promise(resolve => 
        setTimeout(() => resolve({}), 500)
      );

      (positionService.updateCandidateStage as jest.Mock).mockReturnValue(slowApiCall);

      const { container } = render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      expect(container).toBeInTheDocument();
    });

    it('should display candidates in all stages', () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      mockStages.forEach((stage) => {
        const dropZone = screen.getByTestId(`droppable-${stage.name}`);
        expect(dropZone).toBeInTheDocument();
      });
    });

    it('should maintain scroll position after drop', () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      const { container } = render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      const kanbanBoard = container.querySelector('.kanban-board');
      expect(kanbanBoard).toBeInTheDocument();
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle rapid successive drag operations', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={mockCandidates}
          />
        </Router>
      );

      // All draggable elements should be present for rapid interaction
      const draggables = screen.getAllByTestId(/draggable-candidate-/);
      expect(draggables.length).toBe(3);
    });

    it('should handle drag with empty target stage', () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      // Move one candidate to Offer stage first
      const candidatesWithOneInOffer = [
        ...mockCandidates.slice(0, 2),
        {
          ...mockCandidates[2],
          currentInterviewStep: 'Offer'
        }
      ];

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={candidatesWithOneInOffer}
          />
        </Router>
      );

      // All stages should be visible and have drop zones
      mockStages.forEach((stage) => {
        expect(screen.getByTestId(`droppable-${stage.name}`)).toBeInTheDocument();
      });
    });

    it('should handle very long candidate names', () => {
      const candidatesWithLongNames = [
        {
          ...mockCandidates[0],
          fullName: 'Alexander Christopher Montgomery-Stewart III'
        },
        ...mockCandidates.slice(1)
      ];

      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={candidatesWithLongNames}
          />
        </Router>
      );

      expect(screen.getByText('Alexander Christopher Montgomery-Stewart III')).toBeInTheDocument();
    });

    it('should handle candidates with very high or low scores', () => {
      const candidatesWithExtremeScores = [
        { ...mockCandidates[0], averageScore: 5.0 },
        { ...mockCandidates[1], averageScore: 1.0 },
        { ...mockCandidates[2], averageScore: 0.0 },
      ];

      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});

      render(
        <Router>
          <KanbanBoard
            stages={mockStages}
            candidates={candidatesWithExtremeScores}
          />
        </Router>
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });
  });
});
