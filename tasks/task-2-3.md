# Task 2-3: Create API service method to update candidate stage

## Estimation
**1.5 hours**

## Priority
**High**

## Status
Not Started

## Percentage Completed
0%

## Description
Create an API service method in the frontend that updates a candidate's stage:
- Method: updateCandidateStage(applicationId, currentInterviewStep)
- Endpoint: PUT /candidates/:id/stage
- Handle request/response formatting
- Implement proper error handling
- Type responses with TypeScript

Add to candidateService or appropriate service file.

## Definition of Done
- [ ] updateCandidateStage method created
- [ ] Method sends PUT request to /candidates/:id/stage
- [ ] Request body includes applicationId and currentInterviewStep
- [ ] Method returns updated application data
- [ ] Error responses are properly handled
- [ ] TypeScript types are defined for request and response
- [ ] Method logs errors appropriately
- [ ] Method handles network timeouts
- [ ] Method can be called from components

## Notes
- Check backend implementation to ensure request/response format matches
- May need to handle different ID parameter name if backend differs
- Consider retryable errors vs. permanent errors
