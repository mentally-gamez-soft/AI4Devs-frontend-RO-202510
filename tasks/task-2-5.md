# Task 2-5: Implement error handling and rollback mechanism

## Estimation
**2 hours**

## Priority
**High**

## Status
Not Started

## Percentage Completed
0%

## Description
Implement robust error handling and rollback functionality:
- If API call fails, revert candidate to original position
- Show error message to user
- Don't retry automatically (user can manually drag again)
- Handle various error scenarios (network, validation, 500)

This ensures data consistency between frontend and backend.

## Definition of Done
- [ ] API errors are caught and handled
- [ ] On error, candidate card returns to original position
- [ ] Error message is displayed to user
- [ ] Original candidate list state is available for rollback
- [ ] Rollback is immediate (doesn't wait)
- [ ] User can see what went wrong (error details)
- [ ] Multiple error scenarios are handled (network, server, validation)
- [ ] No data loss during failed operations
- [ ] Retry mechanism is clear (user drags again)

## Implementation Notes
- Store previous candidates state before API call
- Use try-catch in onDragEnd handler
- Revert state in catch block
- Show toast/alert with error message
- Consider exponential backoff for retries
- Log errors for debugging
