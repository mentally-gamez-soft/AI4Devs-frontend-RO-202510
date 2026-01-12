# Task 1-7: Add loading and error states

## Estimation
**1.5 hours**

## Priority
**Medium**

## Status
Completed

## Percentage Completed
100%

## Description
Implement comprehensive loading and error handling:
- Show loading spinner while fetching position and candidate data
- Display user-friendly error messages for various error scenarios
- Handle timeout scenarios
- Implement retry functionality
- Show skeleton screens or placeholders for better UX

## Definition of Done
- [x] Loading spinner is displayed while data is being fetched
- [x] Error message is displayed if position data fails to load
- [x] Error message is displayed if candidate data fails to load
- [x] Error messages include helpful information
- [x] Retry button is available when an error occurs
- [x] Skeleton screens or placeholders are shown for better perceived performance
- [x] No API calls are made on error (unless retry is clicked)
- [x] Timeout scenarios are handled gracefully
- [x] User can still navigate away during loading/error states

## Implementation Notes
- Use React state (useState) to manage loading and error states
- Consider using error boundary component for fallback UI
- Show specific error messages for different failure reasons
- Make retry button clearly visible
- Consider using a loading library like react-spinners or create custom spinner
