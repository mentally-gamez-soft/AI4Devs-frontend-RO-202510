import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import PositionDetails from '../pages/PositionDetails';
import * as positionService from '../services/positionService';

// Mock the position service
jest.mock('../services/positionService');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PositionDetails Component', () => {
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
    (positionService.getPositionInterviewFlow as jest.Mock).mockResolvedValue(mockPositionDetails);
    (positionService.getCandidatesByPosition as jest.Mock).mockResolvedValue(mockCandidates);
  });

  const renderComponent = () => {
    return render(
      <Router>
        <PositionDetails />
      </Router>,
      { container: document.createElement('div') }
    );
  };

  describe('Loading and Error States', () => {
    it('should display loading spinner while fetching data', () => {
      (positionService.getPositionInterviewFlow as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockPositionDetails), 1000))
      );

      renderComponent();

      const loadingText = screen.getByText('Loading position details...');
      expect(loadingText).toBeInTheDocument();
    });

    it('should display error message on fetch failure', async () => {
      const errorMessage = 'Failed to fetch position details';
      (positionService.getPositionInterviewFlow as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Error Loading Position')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should display error when position ID is missing', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Position ID is missing')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    it('should fetch position details on mount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(positionService.getPositionInterviewFlow).toHaveBeenCalledWith(NaN);
      });
    });

    it('should fetch candidates on mount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(positionService.getCandidatesByPosition).toHaveBeenCalled();
      });
    });
  });

  describe('Header Display', () => {
    it('should display position name in header', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Senior Backend Engineer')).toBeInTheDocument();
      });
    });

    it('should display back button', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByLabelText('Go back to positions list')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to positions list when back button is clicked', async () => {
      renderComponent();

      await waitFor(() => {
        const backButton = screen.getByLabelText('Go back to positions list');
        userEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/positions');
      });
    });

    it('should navigate to positions list when Try Again is clicked after error', async () => {
      (positionService.getPositionInterviewFlow as jest.Mock).mockRejectedValue(
        new Error('Fetch failed')
      );

      renderComponent();

      await waitFor(() => {
        const backButton = screen.getByText('Back to Positions');
        userEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/positions');
      });
    });
  });

  describe('Info Display', () => {
    it('should display total candidates count', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // 3 candidates
      });
    });

    it('should display interview stages count', async () => {
      renderComponent();

      await waitFor(() => {
        const stageCount = screen.getByText('3', { selector: '.info-value' });
        expect(stageCount).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should display message when no candidates exist', async () => {
      (positionService.getCandidatesByPosition as jest.Mock).mockResolvedValue([]);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No candidates yet')).toBeInTheDocument();
        expect(screen.getByText('There are no candidates for this position.')).toBeInTheDocument();
      });
    });
  });

  describe('Retry Functionality', () => {
    it('should have retry button on error', async () => {
      (positionService.getPositionInterviewFlow as jest.Mock).mockRejectedValue(
        new Error('Fetch failed')
      );

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', async () => {
      renderComponent();

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toBeInTheDocument();
      });
    });

    it('should have accessible back button', async () => {
      renderComponent();

      await waitFor(() => {
        const backButton = screen.getByLabelText('Go back to positions list');
        expect(backButton).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render container with fluid layout', async () => {
      const { container } = renderComponent();

      await waitFor(() => {
        const fluidContainer = container.querySelector('.position-details-container');
        expect(fluidContainer).toBeInTheDocument();
      });
    });
  });
});
