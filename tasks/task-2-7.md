# Task 2-7: Add loading indicator during API call

## Estimation
**1 hour**

## Priority
**Medium**

## Status
Completed

## Percentage Completed
100%

## Description
Add visual feedback to show that an API call is in progress:
- Disable card dragging while API call is pending
- Show loading indicator on the moved card or near it
- Prevent multiple rapid drag-drop operations
- Disable animation until request completes

This prevents users from dragging multiple candidates simultaneously.

## Definition of Done
- [x] Loading indicator appears when API call starts
- [x] Draggable is disabled while request is in progress
- [x] Multiple drag-drop operations are prevented
- [x] Loading indicator disappears when request completes
- [x] Loading indicator appears even if optimistic update shows card moved
- [x] No visual glitches during loading
- [x] Timeout is handled if request takes too long

## Implementation Notes
- Use a loading state in component
- Disable react-beautiful-dnd during loading
- Show spinner or skeleton on card
- Disable onDragEnd handler during loading
- Consider using a queue for operations
