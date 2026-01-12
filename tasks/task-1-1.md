# Task 1-1: Set up React routing for the position details page

## Estimation
**2 hours**

## Priority
**High**

## Status
Not Started

## Percentage Completed
0%

## Description
Set up React Router configuration to add a new route for the position details page. This route should:
- Accept a position ID parameter (e.g., /positions/:id)
- Display the PositionDetails component
- Update the App.tsx routing configuration
- Ensure the back button navigation works correctly

The route should be accessible from the positions list by clicking a button or card.

## Definition of Done
- [ ] React Router is properly configured in App.tsx
- [ ] /positions/:id route renders the PositionDetails component
- [ ] Position ID is accessible as a URL parameter
- [ ] Navigation from the positions list to position details works
- [ ] Back button returns to positions list
- [ ] URL updates correctly when navigating
- [ ] Route is tested and works in both development and production builds

## Notes
- Use React Router v6 (already in dependencies)
- Leverage react-router-dom Link and useNavigate hooks
- Consider using useParams hook to extract the position ID
