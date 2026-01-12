import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CandidateCard from '../components/CandidateCard';

describe('CandidateCard Component', () => {
  const defaultProps = {
    candidateName: 'John Doe',
    score: 4.5,
    candidateId: 1,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render candidate name', () => {
      render(<CandidateCard {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render formatted score with one decimal place', () => {
      render(<CandidateCard {...defaultProps} score={4.5} />);
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('should render N/A when score is null', () => {
      render(<CandidateCard {...defaultProps} score={null} />);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('Score Color Coding', () => {
    it('should apply score-low class for scores <= 2', () => {
      const { container } = render(<CandidateCard {...defaultProps} score={1.5} />);
      const scoreElement = container.querySelector('.score-low');
      expect(scoreElement).toBeInTheDocument();
    });

    it('should apply score-medium class for scores between 2 and 4', () => {
      const { container } = render(<CandidateCard {...defaultProps} score={3.0} />);
      const scoreElement = container.querySelector('.score-medium');
      expect(scoreElement).toBeInTheDocument();
    });

    it('should apply score-high class for scores > 4', () => {
      const { container } = render(<CandidateCard {...defaultProps} score={4.5} />);
      const scoreElement = container.querySelector('.score-high');
      expect(scoreElement).toBeInTheDocument();
    });

    it('should apply score-na class for null/undefined scores', () => {
      const { container } = render(<CandidateCard {...defaultProps} score={null} />);
      const scoreElement = container.querySelector('.score-na');
      expect(scoreElement).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when card is clicked', () => {
      const onClickMock = jest.fn();
      render(<CandidateCard {...defaultProps} onClick={onClickMock} />);
      
      const card = screen.getByRole('button');
      fireEvent.click(card);
      
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when no onClick prop is provided', () => {
      render(<CandidateCard {...defaultProps} onClick={undefined} />);
      
      const card = screen.getByRole('button');
      fireEvent.click(card);
      
      // Should not throw or cause errors
      expect(card).toBeInTheDocument();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should call onClick when Enter key is pressed', () => {
      const onClickMock = jest.fn();
      render(<CandidateCard {...defaultProps} onClick={onClickMock} />);
      
      const card = screen.getByRole('button');
      fireEvent.keyPress(card, { key: 'Enter', code: 'Enter', charCode: 13 });
      
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space key is pressed', () => {
      const onClickMock = jest.fn();
      render(<CandidateCard {...defaultProps} onClick={onClickMock} />);
      
      const card = screen.getByRole('button');
      fireEvent.keyPress(card, { key: ' ', code: 'Space', charCode: 32 });
      
      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should have tabIndex of 0 for keyboard accessibility', () => {
      render(<CandidateCard {...defaultProps} />);
      
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Dragging State', () => {
    it('should apply dragging class when isDragging is true', () => {
      const { container } = render(
        <CandidateCard {...defaultProps} isDragging={true} />
      );
      
      const cardElement = container.querySelector('.candidate-card.dragging');
      expect(cardElement).toBeInTheDocument();
    });

    it('should not apply dragging class when isDragging is false', () => {
      const { container } = render(
        <CandidateCard {...defaultProps} isDragging={false} />
      );
      
      const cardElement = container.querySelector('.candidate-card.dragging');
      expect(cardElement).not.toBeInTheDocument();
    });
  });

  describe('Score Formatting Edge Cases', () => {
    it('should format whole numbers with .0', () => {
      render(<CandidateCard {...defaultProps} score={5} />);
      expect(screen.getByText('5.0')).toBeInTheDocument();
    });

    it('should format score 0', () => {
      render(<CandidateCard {...defaultProps} score={0} />);
      expect(screen.getByText('0.0')).toBeInTheDocument();
    });

    it('should format score with many decimals to one decimal place', () => {
      render(<CandidateCard {...defaultProps} score={3.789} />);
      expect(screen.getByText('3.8')).toBeInTheDocument();
    });
  });
});
