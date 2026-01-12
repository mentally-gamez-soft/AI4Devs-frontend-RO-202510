# Task 3-1: Add score calculation logic in API responses

## Estimation
**1.5 hours**

## Priority
**Medium**

## Status
Completed

## Percentage Completed
100%

## Description
Verify and enhance backend API to include score information in responses:
- Ensure GET /position/:id/candidates returns averageScore for each candidate
- Calculate average from interviews for each candidate
- Format score with one decimal place
- Return 0 or null for candidates with no interviews

Backend service already has this logic; verify it's working correctly.

## Definition of Done
- [x] GET /position/:id/candidates response includes averageScore field
- [x] Score is calculated correctly (average of all interview scores)
- [x] Score is formatted with one decimal place
- [x] Candidates with no interviews show 0 or null
- [x] Score calculation is tested in backend
- [x] API response matches expected format

## Notes
- Check positionService.ts calculateAverageScore function
- Verify it's returning data in correct format
- May need small backend adjustments if not working
