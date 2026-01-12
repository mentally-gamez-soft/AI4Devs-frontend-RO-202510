# Task 1-4: Create the CandidateCard component

## Estimation
**2 hours**

## Priority
**High**

## Status
Completed

## Percentage Completed
100%

## Description
Create a reusable CandidateCard React component that displays:
- Candidate full name
- Candidate score (from averageScore field)
- Visually distinct card styling
- Ready for drag-and-drop interaction

The component should be simple, focused, and easily testable.

## Definition of Done
- [x] CandidateCard component created in src/components/
- [x] Component accepts props: candidate (with id, fullName, averageScore), onClick callback
- [x] Card displays candidate name and score clearly
- [x] Score is formatted to one decimal place or "N/A" if not available
- [x] Component has appropriate styling and hover effects
- [x] Component is prepared for drag functionality (will be added in Task 2-2)
- [x] Component is responsive
- [x] Component includes PropTypes or TypeScript types for validation

## Implementation Notes
- Use React Bootstrap Card component or custom CSS
- Make sure the card is visually distinct and clickable (for modal in Task 4)
- Add hover effect to indicate interactivity
- Keep component focused on display only (no logic)
