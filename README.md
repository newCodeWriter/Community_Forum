<!-- @format -->

# Community Forum

Marshay Brown

# Overview/Description

The project is a React-based web app that utilizes context for state management, React Router for navigation, Express for server side API calls, and Mongodb for database management. This app lets users register and log in to a forum where they can ask and answer questions on select math topics.

# Functionality

The user is first presented with a login and registration page. The user is not able to access any other pages of the app unless they have logged in and have an active token. Once the user registers and logs in, they are assigned an access token. The user can select a topic from the menu to view its questions, if any. If there are no questions posted on the topic, a "new question" button is always present to allow the user to post a question on the selected topic. The user can also click on any question and the app will redirect the user to a page for that specific question where the question and its answers, if any, will be displayed, along with an "answer" button to allow the user to post an answer to the question. If the user posted the question and/or answer, they have the capability to edit and delete the question and/or answer. As to account changes, the user has the option to change its username, email and/or password and delete its account. These options are available in a dropdown submenu item, "account", in the horizontal menu at the top of the dashboard next to the logout button.

# Technologies Used

.html, .css, bootstrap, .js, react, react router, node.js, express, mongodb
