# Task 4-4: Create API service method to fetch full candidate details

## Estimation
**1.5 hours**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Create an API service method to fetch full candidate details:
- Method: getFullCandidateDetails(candidateId)
- Endpoint: GET /candidates/:id
- Returns all candidate information including education, experience, resume, interviews
- Handle errors and loading states
- Type response with TypeScript

## Definition of Done
- [ ] getFullCandidateDetails method created
- [ ] Method sends GET request to /candidates/:id
- [ ] Returns full candidate object with relations
- [ ] TypeScript types defined for response
- [ ] Error handling implemented
- [ ] Method can be called from modal component
- [ ] Response includes all needed fields

## Notes
- Check backend endpoint to verify response format
- May need to enhance backend to include all relations
- Consider caching to avoid multiple requests for same candidate
