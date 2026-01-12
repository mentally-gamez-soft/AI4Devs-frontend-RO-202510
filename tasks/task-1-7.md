# Task 1-7: Add loading and error states

## Estimation
**1.5 hours**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Implement comprehensive loading and error handling:
- Show loading spinner while fetching position and candidate data
- Display user-friendly error messages for various error scenarios
- Handle timeout scenarios
- Implement retry functionality
- Show skeleton screens or placeholders for better UX

## Definition of Done
- [ ] Loading spinner is displayed while data is being fetched
- [ ] Error message is displayed if position data fails to load
- [ ] Error message is displayed if candidate data fails to load
- [ ] Error messages include helpful information
- [ ] Retry button is available when an error occurs
- [ ] Skeleton screens or placeholders are shown for better perceived performance
- [ ] No API calls are made on error (unless retry is clicked)
- [ ] Timeout scenarios are handled gracefully
- [ ] User can still navigate away during loading/error states

## Implementation Notes
- Use React state (useState) to manage loading and error states
- Consider using error boundary component for fallback UI
- Show specific error messages for different failure reasons
- Make retry button clearly visible
- Consider using a loading library like react-spinners or create custom spinner
