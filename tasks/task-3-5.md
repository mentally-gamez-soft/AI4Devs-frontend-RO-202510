# Task 3-5: Implement URL query parameter persistence

## Estimation
**1.5 hours**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Implement URL-based state management for filters:
- Read filter parameters from URL query string (minScore, maxScore)
- Update URL when filters are changed
- Allow users to bookmark/share filter states
- Restore filter state when page is reloaded

## Definition of Done
- [ ] URL includes query parameters: ?minScore=X&maxScore=Y
- [ ] Filter state is read from URL on page load
- [ ] URL is updated when filters are changed
- [ ] Bookmarked URL restores the same filter state
- [ ] Shared URL with others shows the same filters
- [ ] Clear filters button updates URL
- [ ] URL parameters are properly encoded

## Implementation Notes
- Use useSearchParams hook from react-router-dom
- Update URL when filters change
- Read initial filter values from URL
- Handle missing or invalid query parameters
- Test with bookmarks and shared links
