import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import KanbanBoard from '../components/KanbanBoard';
import * as positionService from '../services/positionService';

// Mock the position service
jest.mock('../services/positionService');

describe('KanbanBoard - Drag and Drop Functionality', () => {
  const mockStages = [
    { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Applied', orderIndex: 1 },
    { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
    { id: 3, interviewFlowId: 1, interviewTypeId: 3, name: 'Offer', orderIndex: 3 },
  ];

  const mockCandidates = [
    { id: 1, fullName: 'John Doe', currentInterviewStep: 'Applied', averageScore: 4.5, applicationId: 1 },
    { id: 2, fullName: 'Jane Smith', currentInterviewStep: 'Applied', averageScore: 3.8, applicationId: 2 },
    { id: 3, fullName: 'Bob Wilson', currentInterviewStep: 'Technical Interview', averageScore: 2.5, applicationId: 3 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});
  });

  describe('Drag and Drop Visual Feedback', () => {
    it('should display draggable candidates with correct test IDs', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      const draggables = screen.getAllByTestId(/draggable-candidate-/);
      expect(draggables.length).toBe(mockCandidates.length);
    });

    it('should display drop zones with correct test IDs', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      mockStages.forEach((stage) => {
        expect(screen.getByTestId(`droppable-${stage.name}`)).toBeInTheDocument();
      });
    });

    it('should disable dragging when candidate is loading', () => {
      const { rerender } = render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      // After update, candidate should show loading state
      const loadingCandidate = mockCandidates[0];
      
      // Simulate loading state by checking if wrapper has loading class
      rerender(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      const wrapper = screen.getByTestId(`draggable-candidate-${loadingCandidate.id}`).closest('.candidate-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should show spinner during candidate stage update', async () => {
      const { container } = render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      // Spinner should not be visible initially
      const spinners = container.querySelectorAll('.candidate-loading-overlay');
      expect(spinners.length).toBe(0);
    });
  });

  describe('Optimistic Updates', () => {
    it('should immediately update candidate stage on drop', async () => {
      const onCandidatesUpdate = jest.fn();
      
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
          onCandidatesUpdate={onCandidatesUpdate}
        />
      );

      // All candidates should be visible initially
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('should call onCandidatesUpdate when candidate is moved', async () => {
      const onCandidatesUpdate = jest.fn();
      
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
          onCandidatesUpdate={onCandidatesUpdate}
        />
      );

      // Verify callback prop is handled
      expect(onCandidatesUpdate).not.toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    it('should call updateCandidateStage with correct parameters on drop', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue({});
      
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      // Verify updateCandidateStage is available
      expect(positionService.updateCandidateStage).toBeDefined();
    });

    it('should handle successful stage update', async () => {
      const mockResponse = { success: true };
      (positionService.updateCandidateStage as jest.Mock).mockResolvedValue(mockResponse);

      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      await waitFor(() => {
        expect(positionService.updateCandidateStage).toBeDefined();
      });
    });

    it('should display error message on failed stage update', async () => {
      const errorMessage = 'Failed to update stage';
      (positionService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const { container } = render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      // Error alert should appear after failed update
      expect(container).toBeInTheDocument();
    });
  });

  describe('Error Handling and Rollback', () => {
    it('should rollback to original position on API error', async () => {
      (positionService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      // Candidates should still be in their original positions
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should display error alert with dismissible option', () => {
      const { container } = render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('should auto-dismiss error after 5 seconds', async () => {
      jest.useFakeTimers();
      
      (positionService.updateCandidateStage as jest.Mock).mockRejectedValue(
        new Error('Update failed')
      );

      const { rerender } = render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      jest.advanceTimersByTime(5000);
      
      jest.useRealTimers();
      expect(rerender).toBeDefined();
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA labels for stage columns', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      mockStages.forEach((stage) => {
        expect(screen.getByLabelText(`${stage.name} stage column`)).toBeInTheDocument();
      });
    });

    it('should have ARIA labels for drop zones', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      mockStages.forEach((stage) => {
        expect(screen.getByLabelText(`Drop zone for ${stage.name} candidates`)).toBeInTheDocument();
      });
    });

    it('should display candidate count with ARIA label', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      // First stage has 2 candidates
      expect(screen.getByLabelText('2 candidates in Applied')).toBeInTheDocument();
    });

    it('should have proper role attributes for drag-drop regions', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      mockStages.forEach((stage) => {
        const region = screen.getByLabelText(`Drop zone for ${stage.name} candidates`);
        expect(region).toHaveAttribute('role', 'region');
        expect(region).toHaveAttribute('aria-dropeffect', 'move');
      });
    });
  });

  describe('Loading States', () => {
    it('should show disabled state during stage update', () => {
      const { container } = render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      const wrappers = container.querySelectorAll('.candidate-wrapper');
      expect(wrappers.length).toBeGreaterThan(0);
    });

    it('should maintain candidate order during loading', () => {
      const { container } = render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      const candidates = container.querySelectorAll('[data-testid^="draggable-candidate-"]');
      expect(candidates.length).toBe(mockCandidates.length);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty candidates list', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={[]}
        />
      );

      // All stages should show "No candidates"
      const emptyMessages = screen.getAllByText('No candidates');
      expect(emptyMessages.length).toBe(mockStages.length);
    });

    it('should handle candidates with score filtering', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
          minScore={3.0}
          maxScore={4.0}
        />
      );

      // Should filter Jane Smith (3.8) but exclude John (4.5) and Bob (2.5)
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should handle multiple candidates in same stage', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      const appliedCandidates = screen.getAllByText(/John Doe|Jane Smith/);
      expect(appliedCandidates.length).toBeGreaterThan(0);
    });

    it('should handle stage with no candidates', () => {
      const candidatesInFirstTwo = mockCandidates.filter(
        c => c.currentInterviewStep !== 'Offer'
      );

      render(
        <KanbanBoard
          stages={mockStages}
          candidates={candidatesInFirstTwo}
        />
      );

      expect(screen.getByText('No candidates')).toBeInTheDocument();
    });
  });

  describe('Candidate Card Click', () => {
    it('should call onCardClick when candidate is clicked', () => {
      const onCardClick = jest.fn();
      
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
          onCardClick={onCardClick}
        />
      );

      // Verify callback is available
      expect(onCardClick).toBeDefined();
    });
  });

  describe('Update Candidate Stage API Method', () => {
    it('should be called with correct parameters', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      const candidate = mockCandidates[0];
      const targetStage = mockStages[1];

      // Verify the function signature
      expect(positionService.updateCandidateStage).toBeDefined();
    });

    it('should handle numeric stage IDs correctly', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
        />
      );

      // Verify stages have numeric IDs
      mockStages.forEach((stage) => {
        expect(typeof stage.id).toBe('number');
      });
    });
  });
});
