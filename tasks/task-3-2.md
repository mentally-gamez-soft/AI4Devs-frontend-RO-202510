# Task 3-2: Create FilterBar component with score range inputs

## Estimation
**2 hours**

## Priority
**Medium**

## Status
Completed

## Percentage Completed
100%

## Description
Create a FilterBar component that allows users to filter candidates by score range:
- Input fields for minimum and maximum score
- Clear filters button
- Visual indication when filters are active
- Updates parent state when filters change
- Initial state reflects URL query parameters

## Definition of Done
- [x] FilterBar component created
- [x] Component accepts minScore and maxScore props
- [x] Component has input fields for score range
- [x] Component has "Clear filters" button
- [x] onChange callback is called when filters change
- [x] Visual indicator shows when filters are active
- [x] Component reads initial values from URL query parameters
- [x] Input validation (min <= max)
- [x] Responsive design for mobile devices

## Implementation Notes
- Use React Bootstrap for input fields
- Use Number inputs with min/max attributes
- Debounce filter changes to avoid excessive updates
- Consider using query parameters for URL state
