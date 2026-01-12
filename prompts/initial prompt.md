You are a senior fullstack developer working on an ATS web application.

The application is described in the README.md file of this project.

A new web page needs to be implemented and you will be essentially working on the frontend using the available codebase of the backend. The application uses React for the frontend and Express.js and PostgreSQL through prisma ORM for the backend.

**TASKS**
Implement a page to display the details of a job position: The candidates who applied for it and their current stages in the hiring process. The page should allow the users to:
1. For one job position: View a dashboard of the stages for each and every candidate who applied to this job position. The design should be of type kanban board where each column represents a stage in the hiring process (e.g., Applied, Interviewing, Offered, Hired, Rejected, etc.) and each candidate is represented as a card that can be dragged and dropped between columns to update their stage.
2. Update the stage of a candidate in a job position (e.g., from "Applied" to "Interviewing", "Offered", "Hired", etc.) by dragging and dropping their card between columns on the kanban board. This action should update the candidate's stage in the backend database accordingly.

**CONSTRAINTS**
- The web page should display the following information:
  - Job Position Title and an arrow to go back to the list of job positions
  - All the stages in the hiring process as columns in a kanban board fashion manner
  - Each column can contain cards representing candidates in that specific stage, but can also be empty
  - Each candidate card should display at least:
    - Candidate Name and Surname
    - Candidate score (if available)
- The kanban board should be interactive, allowing users to drag and drop candidate cards between different stages.

**PRE-REQUISITES**
- Before any implementation, you will access and analyze the whole existing codebase of the ATS web application. The application is described in the README.md file of this project.
- You will use React for the frontend development.
- You will use the existing backend API endpoints to fetch job positions, candidates, and update candidate stages.
- You will use any additional libraries or tools as needed to implement the kanban board functionality (e.g., react-beautiful-dnd for drag-and-drop functionality).

**REQUIREMENTS**
- You will create all the user stories you see fit for the above features that you will cut into different tasks if needed.
- Each user story should contain the following sections:
  - Title
  - Description
  - Acceptance Criteria
  - Tasks
  - A mermaid diagram representing the flow of the user story.
- The user stories should be written in markdown format.
- The user stories will be stored in the directory `user-stories` and will be named `user-story-<number>.md` where <number> is the number of the user story.
- The tasks should be stored in the directory `tasks` and will be named `task-<us_number>-<number>.md` where <number> is the number of the task and <us_number> is the number of the user story.
- The tasks will contain the following sections:
  - Title
  - Estimation
  - Priority
  - status
  - percentage completed
  - Description
  - Definition of Done
- Each user story must implement a test suite to verify its functionality. You will the library that fits best for the job (like playwright, jest etc).

**TECHNICAL DETAILS**
- The backend API already has endpoints to get job positions and candidates and it is described as follows:
  - GET /positions/:id/interviewFlow - Get details of a specific job position including candidates and their stages ( example of payload below 
  ```json
  {
      "positionName": "Senior backend engineer",
      "interviewFlow": {
              
              "id": 1,
              "description": "Standard development interview process",
              "interviewSteps": [
                  {
                      "id": 1,
                      "interviewFlowId": 1,
                      "interviewTypeId": 1,
                      "name": "Initial Screening",
                      "orderIndex": 1
                  },
                  {
                      "id": 2,
                      "interviewFlowId": 1,
                      "interviewTypeId": 2,
                      "name": "Technical Interview",
                      "orderIndex": 2
                  },
                  {
                      "id": 3,
                      "interviewFlowId": 1,
                      "interviewTypeId": 3,
                      "name": "Manager Interview",
                      "orderIndex": 2
                  }
              ]
          }
  }
  ```
  - GET /positions/:id/candidates - Get all candidates for a specific job position, example of payload below: 
  ```json
  [
      {
          "id": 1,
          "firstName": "John",
          "lastName": "Doe",
          "score": 85,
          "currentStageId": 2
      },
      {
          "id": 2,
          "firstName": "Jane",
          "lastName": "Smith",
          "score": 90,
          "currentStageId": 1
      }
  ]
  ```

  - PUT /candidates/:id/stage - Update the stage of a candidate, example of payloads below: 
    Request payload:
    ```json
        {
        "applicationId": "1",
        "currentInterviewStep": "3"
        } 
    ```
    Response payload:   
    ```json
    {    
    "message": "Candidate stage updated successfully",
     "data": {
         "id": 1,
         "positionId": 1,
         "candidateId": 1,
         "applicationDate": "2024-06-04T13:34:58.304Z",
         "currentInterviewStep": 3,
         "notes": null,
         "interviews": []    
     }
    }
    ```

  - GET /positions/:id/candidates - Get all the candidates for a specific job position, example of payload below 
  ```json
    [
      {
           "fullName": "Jane Smith",
           "currentInterviewStep": "Technical Interview",
           "averageScore": 4
       },
       {
           "fullName": "Carlos García",
           "currentInterviewStep": "Initial Screening",
           "averageScore": 0            
       },        
       {
           "fullName": "John Doe",
           "currentInterviewStep": "Manager Interview",
           "averageScore": 5            
      }    
   ]
  ```

**IMPLEMENTATION**
- After creating the user stories and tasks, You will wait my aknowledge that I have reviewed them. Then proceed to implement the required web page.
- Make the migrations needed to the database schema if necessary.
- Write a full test suite for unit and integration tests for the new feature to ensure it works as expected in conjunction with the existing codebase and the database.
- Ensure that the code follows best practices for security, performance, and maintainability.
- Document what you did in the user story and tasks.
- Finally, update the user stories and tasks with the actual time taken to complete each task and any notes on challenges faced or decisions made during implementation.
- Should you have any questions regarding the requirements or need further clarification, do not hesitate to ask before proceeding with the implementation.