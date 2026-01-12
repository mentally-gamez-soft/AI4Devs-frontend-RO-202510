# Task 4-7: Display work experience section

## Estimation
**1.5 hours**

## Priority
**Medium**

## Status
Not Started

## Percentage Completed
0%

## Description
Create a section in the modal to display work experience:
- List of work experience entries
- Company name
- Job position/title
- Description
- Start and end dates (or indicate ongoing)
- Formatted timeline style

## Definition of Done
- [ ] Work experience section created
- [ ] Lists all work experience entries
- [ ] Shows company, position, dates, description
- [ ] Dates formatted clearly (MM/YYYY format)
- [ ] Handles ongoing positions (no end date or "Present")
- [ ] Empty state: "No work experience information"
- [ ] Dates sorted (most recent first)
- [ ] Description is optional and shown when available
- [ ] Section is visually organized

## Implementation Notes
- Use similar timeline style as education
- Sort by end date descending
- Detect ongoing positions (null or empty end date)
- Format dates consistently
- Truncate long descriptions with read more if needed
