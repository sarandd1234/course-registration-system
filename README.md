# Sprint 1 : Daily Scrum 
Here is the Sprint 1 (Week 1-2) Daily Scrums. 
(**3/26**)

**Saran : Backend Developer**
Yesterday, I completed the backend development, including authentication, course search, and eligibility endpoints, and fully connected it to the AWS RDS database. I tested all endpoints in Postman to confirm everything is working correctly and returning accurate data.
Today, I’m supporting the team by sharing the backend files, helping with frontend integration, and assisting QA with endpoint testing and validation. I’m also helping troubleshoot any issues that come up during integration and making sure the system flows correctly end-to-end.
I don’t have any blockers at the moment.

**Madilynn : Database Engineer**
Yesterday, I completed the initial database implementation in AWS RDS and confirmed that it successfully connects with the backend. I created the core tables, defined relationships, and inserted sample data.
Today, I’m finalizing the database design by ensuring it fully meets 3NF requirements and adding the remaining data, including the additional instructor and corresponding session. I’m also validating the schema and relationships through SQL queries.
No blockers at the moment.

**Tiffany: Frontend Developer**
Today, I am currently building the basic UI structure, including the login page and shared layout. Now that the backend and database are ready, I am starting to connect the login page to the API and working on the course search page with filters and results display.
I don’t have any blockers right now, but I may need support during integration to make sure the API connections are working correctly. 

**Jeremy – QA Analyst**
Yesterday, I reviewed the sprint requirements and prepared test cases for authentication, course search, and eligibility. Today, now that the backend and database are available, I am beginning testing using Postman and will start documenting results with screenshots.
No blockers at the moment.

(**4/2**)

**Saran : Backend Developer**
Yesterday, I finalized backend integration with the AWS RDS database and supported the team during frontend and testing integration. I helped troubleshoot connection issues, including environment setup such as ensuring proper .env configuration across team members, so the API could run correctly locally.
Today, I am continuing to support integration across the frontend and QA testing, assisting with any issues that come up, and making sure all components are working together smoothly for the sprint review and demo. I am also helping verify that all endpoints return correct data during testing.
I don’t have any blockers at the moment.

**Madilynn : Database Engineer** 
Yesterday, I focused on improving the database design and validating its structure. I updated the ERD to ensure it fully adheres to Third Nominal Form and made sure those changes were accurately reflected in the corresponding entity table. I also ran several COUNT and JOIN queries to verify data relationships and confirm everything is functioning as expected. 
In addition, I successfully executed the table creation script and confirmed the output was correct. To further validate the schema, I ran DESCRIBE on each table to check that all fields, data types, and constraints were properly defined. 
Today, I’ve completed my assigned tasks and plan to connect with my team to prepare for the second sprint and align on next steps. I don’t have any blockers at this time.

**Tiffany : Frontend Developer**
Yesterday, I focused on building out the core frontend functionality, including completing the login page and course search page UI. I connected the frontend to the backend APIs for authentication and course retrieval, allowing users to log in and search for courses by department, course number, and instructor. I also implemented basic validation for login, such as displaying error messages for empty inputs and invalid credentials. During testing, I identified a data mapping issue where the department field is displaying as undefined, which I plan to resolve by aligning frontend field names with backend responses. Today, I am continuing to refine the frontend by improving data display, troubleshooting API integration issues, and beginning to incorporate prerequisite and eligibility feedback into the UI. I am also preparing the frontend for the sprint demo by ensuring all core features function as expected. I don’t have any blockers at the moment, but I will continue collaborating with the backend team to resolve minor integration issues.

**Jeremy: QA Analyst**
Yesterday, I focused on gathering the requirements and understanding what was required of me from my role. Today my role as the QA focused on bridging the gap between our technical requirements and functional, reliable system. I approached the project by verifying each layer of the stack ensuring our authentication API managed credentials confirming that our 3NF database scheme maintained integrity under pressure. Part of my process took place using MySQL Workbench in which I proved that our relationships and constraints were actively protecting the system from duplicate enrollments. I worked to ensure that every user action was backed by solid, verifiable logic with a well structured data foundation 
