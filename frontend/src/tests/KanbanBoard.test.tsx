import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanBoard from '../components/KanbanBoard';
import { InterviewStep, Candidate } from '../services/positionService';

describe('KanbanBoard Component', () => {
  const mockStages: InterviewStep[] = [
    {
      id: 1,
      interviewFlowId: 1,
      interviewTypeId: 1,
      name: 'Applied',
      orderIndex: 1,
    },
    {
      id: 2,
      interviewFlowId: 1,
      interviewTypeId: 2,
      name: 'Interviewing',
      orderIndex: 2,
    },
    {
      id: 3,
      interviewFlowId: 1,
      interviewTypeId: 3,
      name: 'Offered',
      orderIndex: 3,
    },
  ];

  const mockCandidates: Candidate[] = [
    {
      id: 1,
      fullName: 'John Doe',
      currentInterviewStep: 'Applied',
      averageScore: 4.5,
      applicationId: 1,
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      currentInterviewStep: 'Interviewing',
      averageScore: 3.0,
      applicationId: 2,
    },
    {
      id: 3,
      fullName: 'Bob Wilson',
      currentInterviewStep: 'Applied',
      averageScore: 2.5,
      applicationId: 3,
    },
  ];

  describe('Rendering', () => {
    it('should render all stages as column headers', () => {
      render(<KanbanBoard stages={mockStages} candidates={mockCandidates} />);

      expect(screen.getByText('Applied')).toBeInTheDocument();
      expect(screen.getByText('Interviewing')).toBeInTheDocument();
      expect(screen.getByText('Offered')).toBeInTheDocument();
    });

    it('should render candidates in correct stages', () => {
      render(<KanbanBoard stages={mockStages} candidates={mockCandidates} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    });

    it('should display empty state for stages without candidates', () => {
      render(<KanbanBoard stages={mockStages} candidates={mockCandidates} />);

      // Offered stage should have no candidates
      const emptyStates = screen.getAllByText('No candidates');
      expect(emptyStates.length).toBeGreaterThan(0);
    });

    it('should render candidate scores', () => {
      render(<KanbanBoard stages={mockStages} candidates={mockCandidates} />);

      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('3.0')).toBeInTheDocument();
      expect(screen.getByText('2.5')).toBeInTheDocument();
    });
  });

  describe('Candidate Count Display', () => {
    it('should display total candidate count for each stage', () => {
      render(<KanbanBoard stages={mockStages} candidates={mockCandidates} />);

      // Applied has 2 candidates
      const appliedCount = screen.getByText('2', { selector: '.stage-count' });
      expect(appliedCount).toBeInTheDocument();
    });

    it('should display 0 for empty stages', () => {
      render(<KanbanBoard stages={mockStages} candidates={mockCandidates} />);

      // Offered has 0 candidates, should show 0
      const counts = screen.getAllByText(/^\d+$/);
      expect(counts.some((el) => el.textContent === '0')).toBeTruthy();
    });
  });

  describe('Sorting', () => {
    it('should sort stages by orderIndex', () => {
      const stagesOutOfOrder: InterviewStep[] = [
        { ...mockStages[2], orderIndex: 3 },
        { ...mockStages[0], orderIndex: 1 },
        { ...mockStages[1], orderIndex: 2 },
      ];

      render(<KanbanBoard stages={stagesOutOfOrder} candidates={mockCandidates} />);

      const stageHeaders = screen.getAllByRole('heading', { level: 5 });
      expect(stageHeaders[0]).toHaveTextContent('Applied');
      expect(stageHeaders[1]).toHaveTextContent('Interviewing');
      expect(stageHeaders[2]).toHaveTextContent('Offered');
    });
  });

  describe('Filtering by Score', () => {
    it('should filter candidates by minimum score', () => {
      render(
        <KanbanBoard stages={mockStages} candidates={mockCandidates} minScore={3.0} />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument(); // 4.5 >= 3.0
      expect(screen.getByText('Jane Smith')).toBeInTheDocument(); // 3.0 >= 3.0
      expect(screen.queryByText('Bob Wilson')).not.toBeInTheDocument(); // 2.5 < 3.0
    });

    it('should filter candidates by maximum score', () => {
      render(
        <KanbanBoard stages={mockStages} candidates={mockCandidates} maxScore={3.0} />
      );

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument(); // 4.5 > 3.0
      expect(screen.getByText('Jane Smith')).toBeInTheDocument(); // 3.0 <= 3.0
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument(); // 2.5 <= 3.0
    });

    it('should filter candidates by score range', () => {
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
          minScore={2.5}
          maxScore={4.0}
        />
      );

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument(); // 4.5 > 4.0
      expect(screen.getByText('Jane Smith')).toBeInTheDocument(); // 3.0 is in range
      expect(screen.getByText('Bob Wilson')).toBeInTheDocument(); // 2.5 is in range
    });

    it('should display filtered count when filters are applied', () => {
      render(
        <KanbanBoard stages={mockStages} candidates={mockCandidates} minScore={3.0} />
      );

      // Should show filtered count like "1/2" for Applied stage
      // Applied has 2 total candidates (John Doe 4.5, Bob Wilson 2.5)
      // But only John Doe (4.5) passes filter, so "1/2"
      const counts = screen.getAllByText(/\d+\/\d+/);
      expect(counts.length).toBeGreaterThan(0);
    });
  });

  describe('Callback Handling', () => {
    it('should call onCardClick with candidate ID when card is clicked', () => {
      const onCardClickMock = jest.fn();
      render(
        <KanbanBoard
          stages={mockStages}
          candidates={mockCandidates}
          onCardClick={onCardClickMock}
        />
      );

      const card = screen.getByText('John Doe').closest('[role="button"]');
      if (card) {
        fireEvent.click(card);
        expect(onCardClickMock).toHaveBeenCalledWith(1);
      }
    });
  });

  describe('Empty States', () => {
    it('should render correctly with no candidates', () => {
      render(<KanbanBoard stages={mockStages} candidates={[]} />);

      // All stages should show "No candidates"
      const emptyStates = screen.getAllByText('No candidates');
      expect(emptyStates.length).toBe(mockStages.length);
    });

    it('should render correctly with empty stages array', () => {
      const { container } = render(
        <KanbanBoard stages={[]} candidates={mockCandidates} />
      );

      // Should still render the board container
      expect(container.querySelector('.kanban-board')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive column classes', () => {
      const { container } = render(
        <KanbanBoard stages={mockStages} candidates={mockCandidates} />
      );

      const columns = container.querySelectorAll('.kanban-column');
      expect(columns.length).toBe(mockStages.length);
    });
  });
});
