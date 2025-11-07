# My Career Guidance

My Career Guidance is a web application designed to help students plan their career paths and connect with counselors for guidance. The platform provides a comprehensive set of tools for students to explore their interests, set goals, and prepare for their future careers. It also offers a dedicated portal for counselors to manage and support their students.

## Features

### For Students

- **Authentication:** Secure sign-up and login functionality.
- **Dashboard:** A personalized dashboard with an overview of the student's progress.
- **Self-Assessment:** A self-assessment test to help students understand their strengths and interests.
- **My Goals:** A section for students to set and track their career goals.
- **CAO Calculator:** A tool to calculate Central Applications Office (CAO) points.
- **CV and Cover Letter Builder:** A tool to create professional CVs and cover letters.
- **Educational Guidance:** A section with resources and information about different educational paths.
- **My Study:** A tool to help students plan and manage their studies.
- **My Choices:** A section for students to save and review their career choices.
- **Work Diary:** A diary to keep track of work experience and skills.
- **Occupational Exploration:** A tool to explore different occupations and career paths.
- **My Guidance Report:** A comprehensive report of the student's career guidance journey.
- **Subscription:** A subscription model for students to access premium features.

### For Counselors

- **Authentication:** Secure login for counselors.
- **Dashboard:** A dashboard to view and manage their students.
- **Student Information:** Access to detailed information about their students, including their profiles, goals, and progress.
- **Student CV:** View and provide feedback on students' CVs.
- **Student Goals:** Track and guide students in setting and achieving their career goals.
- **Student Choices:** Review and discuss students' career choices.
- **Guidance Report:** Generate and review guidance reports for students.

## User Flows

### Student User Flow

1.  **Sign Up/Login:** A student creates an account or logs in to the platform.
2.  **Subscription:** After logging in, the student is prompted to subscribe to access the platform's features.
3.  **Dashboard:** Upon successful subscription, the student is redirected to their dashboard.
4.  **Explore Features:** The student can then explore the various features of the platform, such as the self-assessment test, CAO calculator, and CV builder.
5.  **Set Goals:** The student can set their career goals and track their progress.
6.  **Seek Guidance:** The student can connect with a counselor for guidance and support.

### Counselor User Flow

1.  **Login:** A counselor logs in to the counselor portal.
2.  **Dashboard:** The counselor is redirected to their dashboard, where they can see a list of their students.
3.  **View Student Details:** The counselor can click on a student's name to view their detailed information.
4.  **Provide Guidance:** The counselor can review the student's progress, provide feedback on their CV, and guide them in their career planning.

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Folder Structure

The project follows a standard React application structure:

-   **`public`:** Contains the public assets of the application, such as `index.html`, `favicon.ico`, and images.
-   **`src`:** Contains the source code of the application.
    -   **`assets`:** Contains static assets such as images, icons, and logos.
    -   **`components`:** Contains reusable UI components.
        -   **`authComponents`:** Components related to authentication (Login, Signup, etc.).
        -   **`commonComponents`:** Common components used throughout the application.
        -   **`conselor`:** Components for the counselor portal.
        -   **Other folders:** Components for different features of the student portal.
    -   **`context`:** Contains the React context providers.
    -   **`routes`:** Contains the routing configuration for the application.
    -   **`utils`:** Contains utility functions and constants.

## Technologies Used

-   **React:** A JavaScript library for building user interfaces.
-   **React Router:** A routing library for React applications.
-   **Ant Design:** A React UI library with a set of high-quality components.
-   **Axios:** A promise-based HTTP client for the browser and Node.js.
-   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.