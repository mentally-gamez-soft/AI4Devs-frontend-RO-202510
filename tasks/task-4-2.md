# Task 4-2: Add click handler to CandidateCard component

## Estimation
**1 hour**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Add onClick handler to CandidateCard to trigger modal opening:
- Card becomes clickable
- Click feedback (cursor change, visual feedback)
- Pass candidate ID to onClick handler
- Parent component manages modal state

## Definition of Done
- [ ] CandidateCard accepts onClick callback prop
- [ ] Clicking card triggers onClick handler
- [ ] Candidate ID is passed to handler
- [ ] Cursor changes on hover (pointer)
- [ ] Visual feedback on click
- [ ] Card is keyboard accessible
- [ ] Handler prevents drag-drop conflicts

## Implementation Notes
- Add onClick event to Card element
- Prevent event propagation if needed
- Make sure drag-drop and click don't conflict
- Add focus management for accessibility
