# Task 2-6: Add visual feedback during drag operations

## Estimation
**1.5 hours**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Implement visual feedback to improve user experience during drag operations:
- Show cursor change when hovering over draggable cards
- Change card appearance during drag (opacity, scale, shadow)
- Highlight drop zones when dragging over them
- Show visual indicators for valid/invalid drop targets

## Definition of Done
- [ ] Cursor changes to grabbing hand when hovering draggable card
- [ ] Card opacity decreases when being dragged
- [ ] Drop zones highlight when dragging over them
- [ ] Drop zone highlight shows valid drop target
- [ ] Visual feedback is immediate and smooth
- [ ] Animations are performant (no jank)
- [ ] CSS transitions are used where appropriate
- [ ] Feedback is consistent across browsers

## Implementation Notes
- Use CSS cursor property for cursor changes
- Use opacity and transform for drag visual effects
- Use background-color or border changes for drop zone highlights
- react-beautiful-dnd provides isDragging and isDraggingOver properties
- Keep animations fast (200ms or less)
