# Password Manager - Full-Stack Web Application
- **Title:** Readme file
- **Date:** Apr 18, 2024
- **Author:** Yiwen Wang
- **Team Member:** Yiwen Wang, Wen Xie
- **Version:** 1.0

**Revision History**
|Date|Version|Description|Author|
|:----:|:----:|:----:|:----:|
|Apr 18, 2024|1.0|Initial Readme| Yiwen Wang|
|Apr 28, 2024|1.0|update Readme with deployment on Heroku| Yiwen Wang|
|July7, 2024|1.0|update Readme | Yiwen Wang|

# Project Overview
- Developed a secure password management web application using JavaScript for full-stack development. Built the backend with Express and Node.js, and the frontend with React, deploying on Heroku.

- Role: Developer

- Technologies Used: JavaScript, React, Express, Node.js, Heroku, MongoDB, Security, User Authentication, CSS, HTML, Git

# Key Contributions and Achievements
- Implemented features like secure password generation, user authentication, user authorization, and encrypted sensitive data.
- Ensuring security and user-friendliness in password management.
- Successfully developed a secure and user-friendly password management application.


# Features:
1. User authentication - Use local storage to save "token"
2. Encrypted sensitive data
3. Register & login
4. share passwords to other user by sending share-requests; if accept, users could see each other's all passwords
5. copy to clipboard
6. edit password
7. Search/filter passwords
8. Visually Obscured Password
9. Cryptographically secure passwords
10. Mobile Responsive adjustments


# Instructions
- To Run this App at local host 8000:
1. direct to Frontend: 
    - `cd frontend`
    - `npm install`
    - `npm start`
2. new terminal, direct to Backend:
    - `cd backend`
    - `npm install`
    - `npm start`
- Public URL: https://yiwen-password-manager-09cea1536aab.herokuapp.com/


# Screenshorts
![homepage](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/1.png)
![login](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/2.png)
![Visually Obscured Password](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/3.png)
![Password Manager Page](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/4.png)
![Password Manage Page - 2](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/5.png)
![show hide passwords](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/6.png)
![edit passwords](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/7.png)
![search or filter passwords](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/8.png)
![send share request](https://github.com/YiwenW312/Password_Manager/blob/main/screenshots/9.png)

# Introduction
This is the final project for CS5610 at Northeasern University Seattle Campus, Spring 2024. We have two team members: Yiwen Wang and Wen Xie. 

# Overview
As more and more companies experience hacks and cybersecurity becomes more important, there are many services that can generate and manage passwords on your behalf.  For this assignment, you will make a simple service that allows you to track and generate passwords on your behalf.  You will also be able to share passwords with other people if you choose.


One note of caution: you may be familiar with programs like LastPass or similar that integrate as an addon to your browser and have features such as auto-inserting or auto-logging in.  I am NOT expecting this kind of functionality.  For your project, you can assume users will simply copy and paste passwords as necessary.


For this assignment, you may work with up to two additional students, to make a group of 3.  You can also tackle this work by yourself as well.


Please note: you are welcome to come up with your own project idea, but you must contact the teaching staff at least a week before the assignment is due to ensure that the code is sufficiently worthwhile and can reasonably meet the expectations of the rubric below.  I am also open to you experimenting with other technologies in your stack, but again, please see me first.  The requests must be submitted before the final class.


Finally, I recommend you use the code I provide in class as a basis for this project as much of the frustrating setup is handled there.

# Rubric
- Core Functionality - 25%
- Working Github and Deployed App - 5%
- Good Pages and Styling - 10%
- RESTful APIs - 20%
- MongoDB, Mongoose and Security Implementation - 20%
- Well Written JavaScript - 10%
- Writeup - 10%
- Bonus Points

# Core Functionality and Pages
The goal of this project is to create a website that can help users track and create passwords, as well as share passwords with people they trust.  When a user comes to the website, they should see a home screen and the option to login or create a new account.  Once the user logs in, they should be able to see all the passwords that are associated with their account.  They should also be able to create a new password for a website.  If the user includes a password with the request, then that password should be chosen: otherwise, you will need to randomly generate a password for that user based on certain parameters. Finally, users should be able to share their passwords with another user.  Either on the password manager page or elsewhere, users should be able to share their passwords with other users in case of some kind of emergency.

## Home Page
The first page that users will see on the page.  It will include the nav bar, (lightly) stylized website name, product description and the names of the creators (i.e., you and your team).  This page should have no other features.

## Navbar
At the top of every page, you should have a nav bar.  This navbar should contain a link back to the home page and a link to a place where a user can login or register a new account.  If the user is logged in, the navbar should still contain a link to the home page, a button to log out and a slightly stylized reference to their username.  The following example is from Redfin.com and shows how the login/register buttons switch to the username when the user is logged in.
Please be aware that most websites have extremely fancy logging in/logging out experiences, including things like modals.  It may be easier to redirect to a new page to login and register.


Once a user is logged in, the navbar should provide a method for users to log out.

## Login/Register
You should have on your website a way for users to register and login to existing accounts.  For new users, you should verify passwords and once a user creates a new user, they will automatically be logged in.  If the user tries to create a user with an existing username, an empty username, empty passwords, or the passwords provided do not match, you should provide an error message to let the user know what has happened.


For existing users, you should provide a way for users to log in.  If the password does not match the username, the password is empty, the username is empty or the username does not exist, then you should provide an error message letting the user know what has happened.


Once a user has logged in, either by creating an account or logging in to an existing account, they should be redirected to their password manager page.


We will be using cookies to track user sessions and delete those cookies when a user logs out.  This will all happen in the backend.


You are given free reign to implement login and register experience as you want, but I recommend to keep it easy by creating 2 different login pages.


## Password Manager Page 
The main feature of your app will be the password manager page.  This page is meant to act as a place to manage, store and generate secure passwords.  There are several different aspects to the page, with more detailed in the “Share Password” section.


At the top of the page, there should be an input field that accepts a URL or other name (I will use URL going forward, but it can be any non-empty string) as well as a second field that accepts a password.  Additionally, there should be 3 checkboxes with the following values: alphabet, numerals, symbols; finally there should be another input field called “length”.  Finally, there should be a submit button.

When a user inputs a URL and password and clicks submit, the browser should make an API request to the backend and store the URL/password in a database.  Once this data is stored, you will want to refresh the user’s password list (not the page, only the data) so the user can see that they successfully stored the data.  In this scenario, if the user clicked any of the checkboxes and updated the “length” field, those values are ignored.

If the user inputs a URL but NOT a password, you will use the checkboxes and length to randomly generate a password for the user based on the length.  At least one checkbox must be checked and the length must be between 4 and 50, inclusive.  For each value on the checkbox, each value must be represented at least once in the generated password.  You are NOT expected to generate a cryptographically secure password here: you can just use the built in random function.

If the user does NOT input a URL and they try to submit, you should show an error to let the user know what is wrong.

Below this password input field, you should list out each URL and password pair as well as the date the value was last updated.  Additionally, you should provide a way for a user to delete or update a URL/password pairing.

The following is an example from Lastpass. Your UI will probably look much simpler and contain the name of the service, the created/updated data and the password in a single row.

## Share Passwords
The last feature is that users should be able to share their passwords with other users.  Somewhere on the password manager page, there should be a way to input another user’s username as well as an “Submit” button.  If the submitted username does not exist in the service or the user submits their own username, you should show an error.


When submitted, the other user should see a message or some indicator on their password manager page that a user wants to share passwords.  Make sure to show the username.


If the user accepts this request, they should be able to see the other user’s passwords below their own, but should not be able to modify or delete them.  Please make it clear whose password they are.  Both users should see each other’s passwords in this way.


If the user rejects the request, the user will not see the request again and no passwords will be shared.

# Working Github and Deployed App Link
For this assignment, I recommend you use Render to host your code, but you are welcome to use any web hosting service you are comfortable with.  Please follow the instructions from the lectures or contact any of the teaching staff to get this set up if you need help.  Please be sure to add the TA’s as collaborators to your Github repos.


Deploying this project can be annoying, so I recommend you use the code I write in class as a basis for this project and follow the guide I include in the syllabus.  If you run into any trouble deploying, do not hesitate to reach out to the teaching staff for help.


# Correct Pages and Good Styling
You are responsible for building out a website with the following pages (this is a good summary or checklist for the above):
* home page or landing page
* register/login page(s)
* password manager page


Additionally, you are required to have a navbar with the specification listed above.


As always, you should have a unique and consistent style across the different pages.  There are no specific styling requirements, but make sure that your website looks good on mobile as well as desktop.  You are welcome to use any 3rd party styling libraries, such as Tailwind, React Bootstrap, Material UI, etc.  Ensure that this is something you would be proud to show an employer.  


Finally, if these views are on different pages, consider sensical and good URL design.


# Well Written JavaScript
Now that we’re writing logic, you must start considering the quality of the code you’re writing.  Functions should be simple, easy to read and avoid repetition.  Make sure to make helper functions to simplify code in the backend and ensure that your React components are as simple as possible.  We are not expecting you to use any “advanced” JavaScript functionality, but you should be writing code that you would be happy to show to a potential employer.
You are welcome to use or not use any library of your choice (this means that you are not expected to use Redux, for instance.)


# RESTful APIs
Since this is a full stack app, you are expected to write backend Express APIs using each of the proper RESTful verbs that we learn in this course: POST, PUT, DELETE and GET.  It is important that your code respects the promise made with these verbs so that there are no unexpected side effects.


# MongoDB, Mongoose and Security Implementation
You should correctly connect MongoDB and Mongoose with your app.  You should have at least 2 collections (i.e., MongoDB tables).
Additionally, your data should be secure in the ways we show in class.  Requests from invalid users should be rejected (for instance, if an API request comes to delete another user’s review, that should not succeed.)


# Bonus Points
These tasks are OPTIONAL but will be good experiences if you’re interested in exploring further into some harder ideas in web development, but remember that the teaching staff will not help you with this.  

## Submit Early - 3pts
Submit this assignment 48 hours before the submission time to receive extra points.

## Data Encryption - 2pts
Since you are working with valuable and secure information, ensure that your user data is encrypted in the database to add an extra level of security.  The walkthrough for this can be found in the slides.

## Easy Copy to Clipboard - 1pt
Next to each password there should be a button that allows users to copy the password to the clipboard (i.e., it should be the same as if the user selected the password and pressed CTRL+C or CMD+C to copy the password).


## Visually Obscured Passwords - 2pts
When a user is looking at their own or shared passwords, there is a small risk that someone else would be able to look at their screen and manually copy the password.  To make this a bit safer, obscure the passwords with some kind of filter.  When the user presses the password or a nearby button, it should reveal the password:

You may copy the style and approach of the above gif, or do your own.


## Password Search - 3pts
As users may have a lot of passwords, provide a search bar at the top of the page that allows users to search for passwords by service/domain name.

## Cryptographically Secure Passwords - 5pts
For this assignment, when you generate a password, we recommend you just use Math.random to generate it.  However, this is not considered very secure.  Update your password generation to be more cryptographically secure and include in your writeup what makes this approach safer than just using Math.random

# Writeup
With your submission, you must include a writeup that touches on the following points.  You may discuss any other ideas that you deem salient to this work:

- extra crdiets: 
    -  Cryptographically Secure Passwords - Update your password generation to be more cryptographically secure and include in your writeup what makes this approach safer than just using Math.random: 
    - Answer: Using Math.random() for generating passwords isn't very secure because it can be predictable, making it easier for hackers to guess the passwords. Instead, we use crypto.randomInt() from Node.js, which is designed to be much safer. It pulls unpredictable data from secure system sources, making the passwords it generates really hard to predict. This switch makes our password creation process more like a high-security lock, keeping users' data safer.

This approach ensures that passwords generated in your application are more secure, catering to the security demands of modern web applications.

- What were some challenges you faced while making this app?
- Given more time, what additional features, functional or design changes would you make
- What assumptions did you make while working on this assignment?
- How long did this assignment take to complete?


# Deliverables
All members of a group must submit their projects individually.

Include all the following in your submission on Canvas:
1. A link to your Github repo.  If you are working with a partner, you may submit a link to the same repo (for grading purposes, the TA’s will likely only look at a single repo so make sure they are identical.)  Please note that your Github repo should be named: {firstname}-{lastname}-project3, and if you’re working with other people, all names should appear on the repo.
2. A link to your deployed app.  As above, if you are working with one or more collaborators, please submit the same link.
3. Your writeup.  If you are working with one or more collaborators, you may each write this together or individually, but please indicate this with your submission.
4. The name of your collaborator(s), if any


# Academic Integrity
As always, all assignments are expected to uphold and follow NEU policies regarding academic integrity.  Any students that violate these policies will be reported to OSCCR immediately.
