import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import './FilterBar.css';

interface FilterBarProps {
  minScore?: number;
  maxScore?: number;
  onFilterChange: (minScore?: number, maxScore?: number) => void;
  isActive: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  minScore,
  maxScore,
  onFilterChange,
  isActive,
}) => {
  const [localMinScore, setLocalMinScore] = useState<string>(minScore?.toString() || '');
  const [localMaxScore, setLocalMaxScore] = useState<string>(maxScore?.toString() || '');
  const [error, setError] = useState<string>('');

  // Update local state when props change
  useEffect(() => {
    setLocalMinScore(minScore?.toString() || '');
    setLocalMaxScore(maxScore?.toString() || '');
    setError('');
  }, [minScore, maxScore]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMinScore(e.target.value);
    setError('');
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMaxScore(e.target.value);
    setError('');
  };

  const validateAndApplyFilters = () => {
    const min = localMinScore ? parseFloat(localMinScore) : undefined;
    const max = localMaxScore ? parseFloat(localMaxScore) : undefined;

    // Validation
    if (min !== undefined && isNaN(min)) {
      setError('Minimum score must be a valid number');
      return;
    }
    if (max !== undefined && isNaN(max)) {
      setError('Maximum score must be a valid number');
      return;
    }
    if (min !== undefined && (min < 0 || min > 5)) {
      setError('Minimum score must be between 0 and 5');
      return;
    }
    if (max !== undefined && (max < 0 || max > 5)) {
      setError('Maximum score must be between 0 and 5');
      return;
    }
    if (min !== undefined && max !== undefined && min > max) {
      setError('Minimum score cannot be greater than maximum score');
      return;
    }

    setError('');
    onFilterChange(min, max);
  };

  const handleApplyFilters = () => {
    validateAndApplyFilters();
  };

  const handleClearFilters = () => {
    setLocalMinScore('');
    setLocalMaxScore('');
    setError('');
    onFilterChange(undefined, undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateAndApplyFilters();
    }
  };

  return (
    <Container fluid className={`filter-bar ${isActive ? 'filter-active' : ''}`}>
      <Row className="align-items-end g-3">
        <Col xs={12} sm={6} md={3}>
          <Form.Group className="filter-group">
            <Form.Label htmlFor="min-score" className="filter-label">
              Min Score
            </Form.Label>
            <InputGroup>
              <Form.Control
                id="min-score"
                type="number"
                placeholder="e.g., 2.5"
                value={localMinScore}
                onChange={handleMinChange}
                onKeyPress={handleKeyPress}
                min="0"
                max="5"
                step="0.1"
                className="filter-input"
                aria-label="Minimum candidate score filter"
              />
              <InputGroup.Text className="score-unit">/5</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Form.Group className="filter-group">
            <Form.Label htmlFor="max-score" className="filter-label">
              Max Score
            </Form.Label>
            <InputGroup>
              <Form.Control
                id="max-score"
                type="number"
                placeholder="e.g., 4.5"
                value={localMaxScore}
                onChange={handleMaxChange}
                onKeyPress={handleKeyPress}
                min="0"
                max="5"
                step="0.1"
                className="filter-input"
                aria-label="Maximum candidate score filter"
              />
              <InputGroup.Text className="score-unit">/5</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <div className="filter-button-group">
            <Button
              variant="primary"
              onClick={handleApplyFilters}
              className="filter-button apply-button"
              aria-label="Apply score filters"
            >
              Apply Filters
            </Button>
          </div>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <div className="filter-button-group">
            <Button
              variant="outline-secondary"
              onClick={handleClearFilters}
              className="filter-button clear-button"
              disabled={!isActive}
              aria-label="Clear all filters"
            >
              Clear Filters
            </Button>
          </div>
        </Col>

        {error && (
          <Col xs={12}>
            <div className="filter-error" role="alert" aria-live="assertive">
              {error}
            </div>
          </Col>
        )}

        {isActive && (
          <Col xs={12}>
            <div className="filter-status" role="status" aria-live="polite">
              <span className="filter-status-icon">✓</span>
              Showing candidates with scores{' '}
              {minScore !== undefined && `≥ ${minScore}`}
              {minScore !== undefined && maxScore !== undefined && ' and '}
              {maxScore !== undefined && `≤ ${maxScore}`}
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default FilterBar;
