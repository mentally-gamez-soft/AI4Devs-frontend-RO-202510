# Task 2-4: Implement optimistic UI updates

## Estimation
**2 hours**

## Priority
**High**

## Status
Completed

## Percentage Completed
100%

## Description
Implement optimistic updates so the UI responds immediately to user actions:
- Update candidate position in state immediately after drop
- Display the moved card in the new stage right away
- Call API asynchronously
- Prepare for rollback if API fails (Task 2-5)

This improves perceived performance and user experience.

## Definition of Done
- [x] Candidate state is updated immediately in onDragEnd handler
- [x] UI reflects the change before API call completes
- [x] Candidate card appears in new column immediately
- [x] Column counts are updated immediately
- [x] No visible delay between drag and state update
- [x] State management approach is clear and maintainable
- [x] Can be easily rolled back if needed

## Implementation Notes
- Use React state (useState) to manage candidates
- Update state immediately in onDragEnd handler
- Make API call after state update
- Store previous state for rollback
- Consider using useCallback for performance
