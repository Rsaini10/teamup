# TeamUp — Project Development Journal

## Problems Faced and Solutions Implemented

This journal documents the technical challenges addressed during the development of **TeamUp**, a web-based student collaboration and teammate recommendation platform.

---

### 1. Connecting the Frontend with the Backend

**Problem:**

One of the challenges was establishing communication between the React frontend and the Node.js backend. Since both applications run on different ports, sending and receiving data required proper API integration.

**Solution:**

We used Axios to send HTTP requests from React to Express REST API endpoints. We also configured CORS to allow communication between the frontend and backend during local development.

**Technologies Used:** React.js, Axios, Node.js, Express.js, CORS

---

### 2. Managing Different Types of Listings

**Problem:**

Our application needed to support two different categories of students:

- Students looking for teammates for their projects.
- Students looking to join an existing team.

Managing both categories separately would make data storage and filtering more complicated.

**Solution:**

We created a common MongoDB Listing model with a `type` field to distinguish between:

- `find-teammate`
- `find-team`

We also implemented filtering through the backend API, allowing users to browse the appropriate listings.

**Technologies Used:** MongoDB, Mongoose, Express.js

---

### 3. Handling Form Validation and Database Storage

**Problem:**

Users could submit incomplete or invalid information, which could result in unusable listings or database errors.

**Solution:**

We added required-field validation in the React form and implemented Mongoose schema validation on the backend.

We also restricted the listing type to predefined values and added error responses for invalid submissions.

**Technologies Used:** React.js, MongoDB, Mongoose

---

### 4. Integrating Python Machine Learning with Node.js

**Problem:**

Our main backend was developed using Node.js, while the recommendation algorithm was implemented in Python.

Integrating these two technologies was a challenge because they run as separate services.

**Solution:**

We developed a separate machine learning API using FastAPI.

The Node.js backend collects project and student information and sends it to the Python service through an HTTP POST request.

The Python service processes the information and returns recommendations in JSON format.

**Technologies Used:** Node.js, Python, FastAPI, Axios

---

### 5. Preventing Self-Recommendations

**Problem:**

A student could create both a project listing and a profile indicating that they were looking for a team.

Without proper filtering, the recommendation system might recommend the project owner as a teammate for their own project.

**Solution:**

We implemented email-based filtering in the backend.

Before sending student profiles to the recommendation engine, the backend excludes candidate listings having the same email address as the project owner.

The email comparison is case-insensitive.

**Technologies Used:** JavaScript, Express.js

---

### 6. Matching Students with Different Skills and Descriptions

**Problem:**

Students describe their technical skills and project interests in different ways.

Simple string comparison would not be sufficient to identify relevant teammates.

**Solution:**

We implemented a content-based recommendation approach using **TF-IDF and Cosine Similarity**.

The process involves:

1. Combining the project title, description, and required skills into text.
2. Converting project and student descriptions into numerical vectors using TF-IDF.
3. Applying cosine similarity to compare the project requirements with student profiles.
4. Generating similarity scores for the candidates.

We used English stop-word removal and one-word and two-word combinations during vectorization.

**Technologies Used:** Python, scikit-learn, TF-IDF, Cosine Similarity

---

### 7. Ranking and Displaying the Most Relevant Teammates

**Problem:**

The recommendation engine could generate multiple candidate matches, but displaying all candidates without proper ranking would make selection difficult.

**Solution:**

We implemented a ranking mechanism based on similarity scores.

The system:

- Calculates similarity percentages.
- Identifies overlapping skills.
- Removes candidates with zero similarity scores.
- Sorts candidates in descending order of similarity.
- Returns up to five recommended teammates.

The frontend displays the recommended candidates along with their similarity scores and matching skills.

**Technologies Used:** Python, FastAPI, React.js

---

### 8. Handling Empty Recommendation Results

**Problem:**

Sometimes, no students may be available for a project. Additionally, text vectorization can fail when the supplied descriptions do not contain usable vocabulary.

Such cases could cause errors in the recommendation process.

**Solution:**

We added exception handling in the Python recommendation service.

When the candidate list is empty or TF-IDF vectorization cannot generate usable features, the API returns an empty recommendation list instead of crashing.

The frontend then displays an appropriate message informing the user that no matching teammates were found.

**Technologies Used:** Python, FastAPI, React.js

---

### 9. Managing Loading States and API Errors

**Problem:**

The recommendation system requires communication between multiple services, which can take time.

Without proper feedback, users might repeatedly click the recommendation button or assume the application has stopped responding.

**Solution:**

We implemented loading and error states using React.

During recommendation processing:

- The recommendation button is disabled.
- A loading message is displayed.
- Results appear after successful completion.
- An error message is displayed if the request fails.

This improved the usability of the application.

**Technologies Used:** React.js, JavaScript, Axios

---

### 10. Keeping Listings Updated After Creation and Deletion

**Problem:**

After creating or deleting a listing, the displayed data could become outdated if the frontend did not retrieve the latest information.

Deleted listings could also leave outdated recommendation results visible.

**Solution:**

We implemented automatic data refreshing after successful listing creation and deletion.

The React application fetches updated listings from the backend. When a listing is deleted, its stored recommendation results are also cleared from the frontend.

This helps keep the interface synchronized with the database.

**Technologies Used:** React.js, Axios, Express.js, MongoDB

---

## Conclusion

During the development of TeamUp, we addressed technical challenges involving frontend-backend communication, database management, machine learning integration, recommendation accuracy, error handling, and user interface responsiveness.

The solutions helped us build a functional student collaboration platform that can recommend potential teammates based on project requirements and student skills.

The project also provided practical experience in full-stack development, REST API integration, database operations, and content-based recommendation systems.
