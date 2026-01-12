# Task 2-8: Ensure accessibility (keyboard navigation)

## Estimation
**2 hours**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Implement accessibility features to allow keyboard navigation and screen reader support:
- Keyboard navigation for focus management
- ARIA labels for draggables and droppables
- Screen reader announcements for drag start/end
- Accessible keyboard shortcuts for drag operations
- Keyboard navigation through candidates and stages

## Definition of Done
- [ ] Tab key navigates through candidate cards
- [ ] Enter/Space keys can initiate drag operations
- [ ] Arrow keys move cards between columns (alternative to mouse drag)
- [ ] Escape key cancels drag operations
- [ ] ARIA labels describe drag operations
- [ ] Screen readers announce when drag starts/ends
- [ ] Focus indicators are visible throughout
- [ ] Component is tested with screen reader (NVDA/JAWS/VoiceOver)

## Implementation Notes
- Use aria-label and aria-describedby for descriptions
- Implement keyboard event handlers
- Consider using aria-live regions for announcements
- Test with keyboard only (no mouse)
- Test with screen readers
- React-beautiful-dnd has some accessibility built-in
