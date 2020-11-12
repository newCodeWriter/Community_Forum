# project_05
Marshay Brown

# Overview/Description

The project is a React-based web app that utilizes Redux for state management, React Router for navigation, Express for server side API calls, and MySQL for database management. This app lets users register and log in to a forum where they can ask and answer questions on select math topics. 

# Functionality

The user is first presented with a login and registration page. The user is not able to access any other pages of the app unless they have logged in and their token has not expired. Once the user registers and logs in, they are assigned an access token with an expiration of 25 minutes and are redirected to a dashboard with a vertical menu of math topics. The user can select a topic from the menu to view its questions, if any. If there are no questions posted on the topic, a "new question" button is always present to allow the user to post a question on the selected topic. If there are questions, the user can click on any question and the app will redirect the user to a page for that specific question where the question and its answers, if any, will be displayed, along with an "answer" button to allow the user to post an answer to the question. If the user posted the question and/or answer, they have the capability to edit and delete the question and/or answer. As to account changes, the user has the option to change its username and/or password and delete its account. These options are available in a dropdown submenu item, "account", in the horizontal menu at the top of the dashboard next to the logout button.  

# Technologies Used

.html,.css, bootstrap, .js, react, react-redux, react router, node.js, express, mysql

# Ideas for improvement

Each time the user logs in, a new access token is created. Instead of creating a new access token on each login, there should be a middleware set up on the server side to authenticate and refresh an existing token for login. 