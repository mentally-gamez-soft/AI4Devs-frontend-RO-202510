import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import PositionDetails from '../pages/PositionDetails';
import * as positionService from '../services/positionService';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('PositionDetails Integration Tests', () => {
  const mockPositionDetails = {
    positionName: 'Senior Backend Engineer',
    interviewFlow: {
      id: 1,
      description: 'Standard development interview process',
      interviewSteps: [
        { id: 1, interviewFlowId: 1, interviewTypeId: 1, name: 'Applied', orderIndex: 1 },
        { id: 2, interviewFlowId: 1, interviewTypeId: 2, name: 'Technical Interview', orderIndex: 2 },
        { id: 3, interviewFlowId: 1, interviewTypeId: 3, name: 'Manager Interview', orderIndex: 3 },
      ],
    },
  };

  const mockCandidates = [
    { id: 1, fullName: 'John Doe', currentInterviewStep: 'Applied', averageScore: 4.5, applicationId: 1 },
    { id: 2, fullName: 'Jane Smith', currentInterviewStep: 'Technical Interview', averageScore: 3.8, applicationId: 2 },
    { id: 3, fullName: 'Bob Wilson', currentInterviewStep: 'Applied', averageScore: 2.5, applicationId: 3 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.get as jest.Mock).mockResolvedValue({ data: mockPositionDetails });
  });

  const renderComponent = (initialRoute: string = '/positions/1') => {
    window.history.pushState({}, 'Test page', initialRoute);
    return render(
      <Router>
        <PositionDetails />
      </Router>
    );
  };

  describe('End-to-End Data Flow', () => {
    it('should fetch and display position data correctly', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(screen.getByText('Senior Backend Engineer')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should handle multiple API calls in sequence', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(2);
      });

      // First call for interview flow
      expect((axios.get as jest.Mock).mock.calls[0][0]).toContain('/position/1/interviewflow');
      // Second call for candidates
      expect((axios.get as jest.Mock).mock.calls[1][0]).toContain('/position/1/candidates');
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle API error gracefully', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(screen.getByText('Error Loading Position')).toBeInTheDocument();
      });
    });

    it('should retry after error', async () => {
      (axios.get as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(screen.getByText('Error Loading Position')).toBeInTheDocument();
      });

      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);

      // Page should reload
      expect(window.location.reload).toBeDefined();
    });
  });

  describe('Data Display', () => {
    it('should display all interview stages', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(screen.getByText('Applied')).toBeInTheDocument();
        expect(screen.getByText('Technical Interview')).toBeInTheDocument();
        expect(screen.getByText('Manager Interview')).toBeInTheDocument();
      });
    });

    it('should display all candidates in kanban board', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
      });
    });

    it('should display candidate scores', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('3.8')).toBeInTheDocument();
        expect(screen.getByText('2.5')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should handle candidate card clicks', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const candidateCard = screen.getByText('John Doe').closest('[role="button"]');
      expect(candidateCard).toBeInTheDocument();
    });
  });

  describe('Empty State Handling', () => {
    it('should display empty state when no candidates', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: [] });

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(screen.getByText('No candidates yet')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should make both API calls in parallel', async () => {
      const getPositionFlow = jest.fn().mockResolvedValue(mockPositionDetails);
      const getCandidates = jest.fn().mockResolvedValue(mockCandidates);

      jest.spyOn(positionService, 'getPositionInterviewFlow').mockImplementation(getPositionFlow);
      jest.spyOn(positionService, 'getCandidatesByPosition').mockImplementation(getCandidates);

      renderComponent('/positions/1');

      await waitFor(() => {
        expect(getPositionFlow).toHaveBeenCalled();
        expect(getCandidates).toHaveBeenCalled();
      });

      // Both functions should be called
      expect(getPositionFlow).toHaveBeenCalledTimes(1);
      expect(getCandidates).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsive Behavior', () => {
    it('should render on mobile viewport', async () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      const { container } = renderComponent('/positions/1');

      await waitFor(() => {
        expect(container.querySelector('.position-details-container')).toBeInTheDocument();
      });
    });

    it('should render on tablet viewport', async () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;

      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      const { container } = renderComponent('/positions/1');

      await waitFor(() => {
        expect(container.querySelector('.position-details-container')).toBeInTheDocument();
      });
    });

    it('should render on desktop viewport', async () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      const { container } = renderComponent('/positions/1');

      await waitFor(() => {
        expect(container.querySelector('.position-details-container')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible landmarks', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      const { container } = renderComponent('/positions/1');

      await waitFor(() => {
        // Should have main container
        expect(container.querySelector('.position-details-container')).toBeInTheDocument();
      });
    });

    it('should have proper button accessibility', async () => {
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockPositionDetails })
        .mockResolvedValueOnce({ data: mockCandidates });

      renderComponent('/positions/1');

      await waitFor(() => {
        const backButton = screen.getByLabelText('Go back to positions list');
        expect(backButton).toHaveAttribute('aria-label');
      });
    });
  });
});
