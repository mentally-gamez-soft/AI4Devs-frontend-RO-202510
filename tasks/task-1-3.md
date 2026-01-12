# Task 1-3: Create the KanbanBoard component with column structure

## Estimation
**3 hours**

## Priority
**High**

## Status
Not Started

## Percentage Completed
0%

## Description
Create a KanbanBoard React component that:
- Accepts interview stages and candidates as props
- Displays stages as columns
- Shows candidate cards in appropriate columns
- Displays column headers with stage name and candidate count
- Shows empty state for columns with no candidates
- Prepares structure for drag-and-drop (Task 2-2)

The component should be reusable and well-structured for future enhancements.

## Definition of Done
- [ ] KanbanBoard component created in src/components/
- [ ] Component accepts props: stages, candidates, onDragEnd callback
- [ ] Each stage is rendered as a column with header
- [ ] Column header displays stage name and candidate count
- [ ] Columns display CandidateCard components for relevant candidates
- [ ] Empty state is shown for columns with no candidates
- [ ] Component is responsive and displays well on different screen sizes
- [ ] CSS/Styling is clean and organized
- [ ] Component can be easily tested

## Implementation Notes
- Create TypeScript interfaces for stages and candidates
- Use Bootstrap or CSS Grid for column layout
- Consider using a container div for each column to prepare for drop zones
- Ensure proper spacing and visual hierarchy
