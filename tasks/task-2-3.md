# Task 2-3: Create API service method to update candidate stage

## Estimation
**1.5 hours**

## Priority
**High**

## Status
Completed

## Percentage Completed
100%

## Description
Create an API service method in the frontend that updates a candidate's stage:
- Method: updateCandidateStage(applicationId, currentInterviewStep)
- Endpoint: PUT /candidates/:id/stage
- Handle request/response formatting
- Implement proper error handling
- Type responses with TypeScript

Add to candidateService or appropriate service file.

## Definition of Done
- [x] updateCandidateStage method created
- [x] Method sends PUT request to /candidates/:id/stage
- [x] Request body includes applicationId and currentInterviewStep
- [x] Method returns updated application data
- [x] Error responses are properly handled
- [x] TypeScript types are defined for request and response
- [x] Method logs errors appropriately
- [x] Method handles network timeouts
- [x] Method can be called from components

## Notes
- Check backend implementation to ensure request/response format matches
- May need to handle different ID parameter name if backend differs
- Consider retryable errors vs. permanent errors
