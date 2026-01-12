# Task 3-2: Create FilterBar component with score range inputs

## Estimation
**2 hours**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Create a FilterBar component that allows users to filter candidates by score range:
- Input fields for minimum and maximum score
- Clear filters button
- Visual indication when filters are active
- Updates parent state when filters change
- Initial state reflects URL query parameters

## Definition of Done
- [ ] FilterBar component created
- [ ] Component accepts minScore and maxScore props
- [ ] Component has input fields for score range
- [ ] Component has "Clear filters" button
- [ ] onChange callback is called when filters change
- [ ] Visual indicator shows when filters are active
- [ ] Component reads initial values from URL query parameters
- [ ] Input validation (min <= max)
- [ ] Responsive design for mobile devices

## Implementation Notes
- Use React Bootstrap for input fields
- Use Number inputs with min/max attributes
- Debounce filter changes to avoid excessive updates
- Consider using query parameters for URL state
