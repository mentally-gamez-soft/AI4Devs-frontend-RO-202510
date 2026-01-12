# Task 3-7: Add clear filters button functionality

## Estimation
**0.5 hours**

## Priority
**Low**

## Status
Completed

## Percentage Completed
100%

## Description
Implement the clear filters button functionality:
- Click button resets all filters to default
- Updates URL to remove query parameters
- Re-displays all candidates
- Provides visual feedback

## Definition of Done
- [ ] Clear filters button is visible in FilterBar
- [ ] Clicking button clears minScore and maxScore
- [ ] URL query parameters are removed
- [ ] All candidates are displayed again
- [ ] Button is only visible when filters are active
- [ ] Button click feedback is provided

## Implementation Notes
- Disable button when no filters are active
- Call reset function in parent component
- Update URL query parameters
- Consider showing confirmation if needed
