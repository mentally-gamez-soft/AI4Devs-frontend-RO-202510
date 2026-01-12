# Task 1-5: Create the PositionDetails page component

## Estimation
**2.5 hours**

## Priority
**High**

## Status
Completed

## Percentage Completed
100%

## Description
Create the main PositionDetails page component that:
- Displays the job position title
- Shows a back button to return to positions list
- Fetches position details and candidates
- Integrates the KanbanBoard component
- Manages loading and error states

This is the parent component that orchestrates the entire feature.

## Definition of Done
- [x] PositionDetails component created in src/pages/ or src/components/
- [x] Component uses useParams hook to get position ID from URL
- [x] Component uses useNavigate hook for back button
- [x] Position title is displayed at the top of the page
- [x] Back button is functional and styled appropriately
- [x] Loading state is displayed while fetching data
- [x] Error state is displayed if data fetch fails
- [x] KanbanBoard component is rendered with fetched data
- [x] Component properly handles component lifecycle
- [x] TypeScript types are properly defined

## Implementation Notes
- Use useEffect hook to fetch data when component mounts
- Implement proper error handling and user-friendly error messages
- Show a loading spinner or skeleton while fetching
- Pass down callbacks for drag-and-drop (placeholder for now)
- Ensure proper data flow from API to child components
