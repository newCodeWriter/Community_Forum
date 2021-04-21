<!-- @format -->
# MathQue

MathQue is a web application that lets users register and log in to a forum where they can ask and answer questions on select math topics. This app utilizes context for state management, React Router for navigation, Express for server side API calls, and Mongodb for database management.

## Contributors

Built and designed by Marshay

## Preview/Demo
<img width="1440" alt="Screen Shot 2021-04-20 at 7 39 59 PM" src="https://user-images.githubusercontent.com/65259996/115476604-378b8900-a210-11eb-8893-247e1d810943.png">
<img width="1440" alt="Screen Shot 2021-04-20 at 7 41 16 PM" src="https://user-images.githubusercontent.com/65259996/115476886-c6000a80-a210-11eb-9bce-2b7a3472ac99.png">
<img width="1440" alt="Screen Shot 2021-04-20 at 7 43 19 PM" src="https://user-images.githubusercontent.com/65259996/115476900-cd271880-a210-11eb-90ae-a87161c01387.png">
<img width="1440" alt="Screen Shot 2021-04-20 at 7 25 14 PM" src="https://user-images.githubusercontent.com/65259996/115476920-d617ea00-a210-11eb-979e-2f5b39e0735b.png">

## Tech/Framework

React.js<br/>
Express / Node.js <br/>
MongoDB <br/>
React-Router <br/>
Cookie-parser <br/>
JWT <br/>
Bcrypt <br/>

## Getting started
### Installations

1. cd to the client directory(front-end)
2. Install dependencies via npm install
3. start app via npm start
5. Go to http://localhost:3000 on the browser
6. At root of directory, npm install for back-end dependencies
7. run 'npm run dev' to start the server
8. server will run at http://localhost:5000

## Features
### Feature Overview

- user can login with either username or email
- dashboard is restricted to registered users
- snackbar notification 5 min prior to automatic logout (pending)
- user can update/delete answers and questions they post
- user can change username, email and/or password
- user can delete account
- badge notification if another user answered your question (pending)
