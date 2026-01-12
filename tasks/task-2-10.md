# Task 2-10: Write integration tests for API updates

## Estimation
**3 hours**

## Priority
**High**

## Status
Completed

## Percentage Completed
100%

## Description
Create integration tests that verify the complete drag-drop-update flow:
- Drag candidate from one stage to another
- Verify API call is made with correct parameters
- Verify candidate appears in new stage after update
- Verify error scenarios and rollback
- Test across different browsers if using Playwright

## Definition of Done
- [x] Test drag candidate from Applied to Interviewing
- [x] Test drag candidate from Interviewing to Offered
- [x] Test drag candidate from Offered to Hired
- [x] Test drag candidate back to previous stage
- [x] Test API is called with correct payload
- [x] Test candidate appears in new stage
- [x] Test error scenario (API fails, candidate returns to original stage)
- [x] Test multiple candidates in same stage
- [x] Test all stage transitions
- [x] All tests pass

## Implementation Notes
- Use Playwright or Cypress for E2E testing
- Mock backend API using intercepts
- Use realistic test data
- Test user interactions (drag and drop)
- Consider performance (tests shouldn't be too slow)
