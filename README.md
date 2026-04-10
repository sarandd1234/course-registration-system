# Sprint 1 & 2 : Daily Scrum 
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
Yesterday, I finalized the backend setup and confirmed all endpoints (authentication, course search, and eligibility) are fully working and connected to the AWS RDS database. I also helped fix file structure issues in GitHub by organizing everything into a proper backend folder so the team can run the project correctly.
Today, I’m supporting the team by helping everyone re-clone the repo, set up their environment (.env file), and troubleshoot any connection or server issues. I’m also assisting with frontend integration and helping QA begin testing endpoints.
I don’t have any blockers at the moment, but I’m actively helping resolve team issues related to setup and syncing.

**Madilynn : Database Engineer** 
Yesterday, I focused on improving the database design and validating its structure. I updated the ERD to ensure it fully adheres to Third Nominal Form and made sure those changes were accurately reflected in the corresponding entity table. I also ran several COUNT and JOIN queries to verify data relationships and confirm everything is functioning as expected. 
In addition, I successfully executed the table creation script and confirmed the output was correct. To further validate the schema, I ran DESCRIBE on each table to check that all fields, data types, and constraints were properly defined. 
Today, I’ve completed my assigned tasks and plan to connect with my team to prepare for the second sprint and align on next steps. I don’t have any blockers at this time.

**Tiffany : Frontend Developer**
Yesterday, I focused on building out the core frontend functionality, including completing the login page and course search page UI. I connected the frontend to the backend APIs for authentication and course retrieval, allowing users to log in and search for courses by department, course number, and instructor. I also implemented basic validation for login, such as displaying error messages for empty inputs and invalid credentials. During testing, I identified a data mapping issue where the department field is displaying as undefined, which I plan to resolve by aligning frontend field names with backend responses. Today, I am continuing to refine the frontend by improving data display, troubleshooting API integration issues, and beginning to incorporate prerequisite and eligibility feedback into the UI. I am also preparing the frontend for the sprint demo by ensuring all core features function as expected. I don’t have any blockers at the moment, but I will continue collaborating with the backend team to resolve minor integration issues.

**Jeremy: QA Analyst**
Yesterday, I focused on gathering the requirements and understanding what was required of me from my role. Today my role as the QA focused on bridging the gap between our technical requirements and functional, reliable system. I approached the project by verifying each layer of the stack ensuring our authentication API managed credentials confirming that our 3NF database scheme maintained integrity under pressure. Part of my process took place using MySQL Workbench in which I proved that our relationships and constraints were actively protecting the system from duplicate enrollments. I worked to ensure that every user action was backed by solid, verifiable logic with a well structured data foundation . No blockers at the moment.

Here is the Sprint 2 (Week 3-4) Daily Scrums. 
(**4/08**)

**Saran : Backend Developer**
Yesterday, I fixed the frontend/API undefined response issue so the frontend now receives the correct data fields consistently. I also completed and tested the prerequisite validation logic, making sure students are blocked from enrolling when required prerequisites are not met. In addition, I built the enrollment endpoint structure, including prerequisite blocking and Enrollment table insertion, and created the waitlist endpoint structure for courses that reach capacity. I also supported frontend integration by providing Tiffany with the correct API contracts and response formats needed to connect the UI to the backend.

Today, I will continue working on the remaining enrollment logic by adding the seat capacity check once the database updates are finalized. I will also help connect the live waitlist table integration after Madilynn completes the related database changes. In addition, I’ll support frontend testing with Tiffany to make sure the add course workflow, confirmation messages, and backend responses display correctly in the interface, while also helping Jeremy verify that waitlist and enrollment features function smoothly end-to-end.
At the moment, I do not have any blockers, but the final seat validation and live waitlist integration depend on the database updates being completed.

**Tiffany : Frontend Developer**
Yesterday, I worked on the main frontend features for Sprint 2. I built the Enroll button and connected it to the backend, handling success and error messages. I also created the Join Waitlist button and started integrating it with the waitlist API. In addition, I set up the basic dashboard layout and built the confirmation popup UI for successful enrollment.
Today, I’m continuing to improve API integration and making sure the UI correctly handles different responses like prerequisite failures and full classes. I’m also testing different user scenarios and working on making the frontend flow smoothly with the backend.
I don’t have any blockers right now, but I’ll reach out if any issues come up during integration.

**Madilynn : Database Engineer**
Yesterday, I transferred the database server to a new AWS account since the previous one was about to run out of funds. After that, I made sure the whole team was informed about the change and confirmed that everyone could successfully connect and update their work as needed. Today, I'll be working on adding a waitlist table to the database, and I'll also implement a capacity integer field in the sessions table to enforce limits on class enrollments. I don't have any blockers at the moment. 

**Jeremy: QA Tester/Frontend Developer**
Yesterday I looked at the user stories and broke down each task into managable tasks. I ensured that each task was specific and actionable and small enough that it would allow for each group member to complete. Today I will ensure that I understand what is required of me to complete each task given in the user stories. I will also start working on designing the layout of the web pages on paper as a rough idea to understand how a new user would navigate through the web page and make everything accessible within 3 clicks and minimize scrolling. At the moment there are no blockers.
