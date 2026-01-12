# Task 4-3: Implement modal open/close functionality

## Estimation
**1 hour**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Manage modal state in PositionDetails component:
- Track modal open/close state
- Track selected candidate ID
- Open modal when card is clicked
- Close modal on close button click or outside click
- Pass state to modal component

## Definition of Done
- [ ] useModalState hook or useState for modal state
- [ ] onCardClick handler opens modal with candidate ID
- [ ] onCloseModal handler closes modal
- [ ] Modal open state is managed correctly
- [ ] Selected candidate ID is tracked
- [ ] Modal can be opened and closed multiple times
- [ ] State is clean after closing

## Implementation Notes
- Use useState to manage modal visibility
- Use useState to track selected candidate ID
- Pass callbacks to child components
- Consider using Context API for deeply nested props
