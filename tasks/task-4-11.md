# Task 4-11: Add loading and error states for modal content

## Estimation
**1.5 hours**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Implement loading and error handling for modal content:
- Show loading spinner while fetching candidate details
- Show error message if fetch fails
- Retry button on error
- Skeleton screens for perceived performance
- Timeout handling

## Definition of Done
- [ ] Loading spinner shown while fetching
- [ ] Skeleton screens displayed for better UX
- [ ] Error message shown on fetch failure
- [ ] Retry button available on error
- [ ] Timeout handled gracefully
- [ ] User can close modal during loading/error
- [ ] States transition smoothly

## Implementation Notes
- Use loading state in useEffect
- Show spinner or skeleton
- Handle errors in catch block
- Provide retry function
- Set timeout limit (e.g., 10 seconds)
