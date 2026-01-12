# Task 1-2: Create API service methods for fetching position and candidate data

## Estimation
**1.5 hours**

## Priority
**High**

## Status
Not Started

## Percentage Completed
0%

## Description
Create API service methods in the frontend that will:
1. Fetch position details and interview flow: GET /position/:id/interviewflow
2. Fetch candidates for a position: GET /position/:id/candidates
3. Handle loading and error states
4. Properly type response data (TypeScript)

The methods should be added to the candidateService or a new positionService in src/services/.

## Definition of Done
- [ ] getPositionInterviewFlow(id: number) method created and returns position name + interview steps
- [ ] getCandidatesByPosition(id: number) method created and returns candidate list
- [ ] Both methods are properly typed with TypeScript interfaces
- [ ] Error handling is implemented for failed requests
- [ ] Methods work with the existing axios configuration
- [ ] Service methods are exported for use in components
- [ ] Methods handle edge cases (empty responses, network errors)

## Notes
- Use axios for HTTP requests (already in dependencies)
- Consider creating TypeScript interfaces for Position, InterviewStep, and Candidate
- Ensure the backend API returns data in the expected format
- Handle timeout scenarios
