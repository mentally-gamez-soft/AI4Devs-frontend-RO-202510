# Task 3-6: Update column headers with statistics

## Estimation
**1 hour**

## Priority
**Medium**

## Status
Completed

## Percentage Completed
100%

## Description
Enhance column headers to show candidate statistics:
- Display total number of candidates (before filtering)
- Display filtered count in parentheses (after filtering)
- Update counts in real-time as filters change
- Format: "Stage Name (5/10)" where 5 is filtered count, 10 is total

## Definition of Done
- [ ] Column header shows stage name
- [ ] Column header shows total candidate count
- [ ] Column header shows filtered count (if filters applied)
- [ ] Format is clear and readable
- [ ] Counts update when filters change
- [ ] Works correctly when no filters applied
- [ ] Shows "(0/5)" when no candidates match filter

## Implementation Notes
- Modify KanbanColumn or column header rendering
- Calculate both total and filtered counts
- Update counts dynamically
- Keep header design clean and readable
