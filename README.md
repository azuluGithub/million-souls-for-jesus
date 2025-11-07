<h1>:heart: MATCHA :heart:</h1>

```diff
# Is a WeThinkCode_ project.
```

<em>Click here to go to Matcha:</em> [Matcha Dating Site!](https://matcha-azulu.herokuapp.com/login)

<hr />

<em>To get project subject:</em> [Matcha Subject!](https://github.com/wethinkcode-students/web/blob/master/2%20-%20matcha/matcha.en.pdf)<br />
<em>To get project marking sheet:</em> [Matcha Marking Sheet!](https://github.com/wethinkcode-students/web/blob/master/2%20-%20matcha/matcha.markingsheet.pdf)

<hr />

<h2> Description </h2>

 ```diff
 + This project is about creating a dating website.
 + The app allows two potential lovers to meet, from the registration to the final encounter.
 + A user is able to register, connect, fill his or her profile, search and look into the profile of other users, like them, chat with those that "liked" back.
```
:couple_with_heart: :heart: :love_letter: :lips: :couple:

<hr />

<h2> Features :movie_camera: :camera: :floppy_disk: :video_camera:</h2>  

```diff
- Registration and Signing-in
- User profile
- Browsing
- Research
- Profile of other users
- Chat
- Notifications
```
<hr />

<h2> Stack || Languages :speech_balloon: :thought_balloon:</h2> 

<h3> Front-End: </h3>

```diff
# JavaScript (ES6+)
# React JS
# Redux
# HTML
# CSS
# Bootstrap
```

<h3> Server: </h3>

```diff
# Node JS
# Express JS
```
  
<h3> Back-End: </h3>

```diff
# Postgres SQL database
# Knex JS
# Cloudinary database
```

<hr />

<h2>Front-End NPM Packages :package::package::package:</h2>
<em>for package versions: npm install package_name</em>

 <ul>
    <li>
      <em>
        <strong>
          leaflet && react-leaflet:
        </strong>
       </em>
    </li>
    
```diff
# map display
```
    
   <li>
      <em>
        <strong>
          moment:
        </strong>
       </em>
    </li>
    
```diff
# time conversion
```

   <li>
      <em>
        <strong>
          react-redux:
        </strong>
       </em>
    </li>

```diff
# connecting redux to react app
```

   <li>
      <em>
        <strong>
          react-router-dom:
        </strong>
       </em>
    </li>
    
```diff
# front-end routing e.g "/dashboad"
```

  <li>
      <em>
        <strong>
          react-scroll-to-bottom:
        </strong>
       </em>
    </li>
    
```diff
# provides a scrollbar component
```

   <li>
      <em>
        <strong>
          redux:
        </strong>
       </em>
    </li>
    
```diff
# global state of an application
```

  </ul>
  
<hr />

<h2>Back-End NPM Packages :package:</h2> 

  <ul>
   <li>
      <em>
        <strong>
          bcrypt-nodejs:
        </strong>
       </em>
    </li>
    
```diff
# password hashing, encryption and decryption
```

   <li>
      <em>
        <strong>
          body-parser:
        </strong>
       </em>
    </li>
    
```diff
# extracts the entire body portion of an incoming request stream and exposes it on req.body.
```

   <li>
      <em>
        <strong>
          cors:
        </strong>
       </em>
    </li>
    
```diff
# Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
```

  <li>
      <em>
        <strong>
          cloudinary:
        </strong>
       </em>
    </li>
    
```diff
# cloud database that store images
```

  <li>
      <em>
        <strong>
          dotenv:
        </strong>
       </em>
    </li>
    
```diff
# used with .gitignore to hide configurations and api keys from being shared on github
```

  <li>
      <em>
        <strong>
          express:
        </strong>
       </em>
    </li>
    
```diff
# for creating a server and back-end routing
```

  <li>
      <em>
        <strong>
          express-form-data:
        </strong>
       </em>
    </li>
    
```diff
# sends form to the server
```

  <li>
      <em>
        <strong>
          knex:
        </strong>
       </em>
    </li>
    
```diff
# connects to database to store or fetch data
```

  <li>
      <em>
        <strong>
          nodemon:
        </strong>
       </em>
    </li>
    
```diff
# listens to file changes and restarts server during development if they are any changes made to the file
```

  <li>
      <em>
        <strong>
          nodemailer:
        </strong>
       </em>
    </li>
    
```diff
# sends email to the user after registration or request for password reset
```

  <li>
      <em>
        <strong>
          pg:
        </strong>
       </em>
    </li>
    
```diff
# postgres database stores information of all users
```

<li>
      <em>
        <strong>
          randomstring:
        </strong>
       </em>
    </li>
    
```diff
# works as string shuffle mechanism e.g to generate tokens used during email verification process
```

  </ul>

<hr />

<h2> Project Structure </h2>

<h3> Front-End: </h3>

```diff
# React part of the app resposible for user interface
```

- components
   - auth
   - bio
   - chat
   - dashboard
   - extendedprofile
   - footer
   - map
   - nav
   - notifications
   - port
   - profile
   - scrollbar
   - update
   - upload
   - user
   - App.css
   - App.js
     
```diff
# Redux part of the app which stores the global state of the application for easy accessibility of data from any component
```

 - store
   - actions
   - constants
   - reducers
   
```diff
# Entry point of the app
```
   
- index.js

<h3> Back-End: </h3>

```diff
+ End Points where front-end request are processed e.g inserting user to database
```

 - controllers
   - GetData.js
   - Interations.js
   - Upload.js
   - Update.js
   - Messages.js
   - Register.js

```diff
+ port at which front-end runs
```

 - port
   
```diff
+ Connects app to database and allows data to be inserted and fetched from database
```

 - server.js
   
```diff
+ Sends mail to user for registration and password reset
```

 - mailer.js
 
```diff
+ hides api keys from github
```

- .env

<hr />


<h2> RUNNING THE PROJECT :running: :running: :running: :runner: :runner:</h2> 

<h3> Requirements :warning:</h3> 

<ul>
   <li>
      <em>
        <strong>
          Node js:
        </strong>
       </em>
    </li>
    
```diff
# Download nodejs to be able to run npm commands inside matcha app
```
   <li>
      <em>
        <strong>
          Postgres database:
        </strong>
       </em>
    </li>
    
```diff
# Download postgres to be able to store all user info for matcha app
```

  <li>
      <em>
        <strong>
          Cloudinary database:
        </strong>
       </em>
    </li>
    
```diff
# Enables you to store all app images
```

  <li>
      <em>
        <strong>
          Git:
        </strong>
       </em>
    </li>
    
```diff
# To use git commands e.g to clone the matcha project
```

</ul>

:arrow_down: :arrow_down: :arrow_down:

<em>Download nodejs here:</em> [node js!](https://nodejs.org/en/)<br />
<em>Download postgres database here:</em> [postgres database!](https://www.postgresql.org/download/)<br />
<em>Signup to cloudinary here:</em> [cloudinary database!](https://cloudinary.com/)<br />
<em>Download Git here:</em> [git!](https://git-scm.com/)

<hr />

<h2> Set Up Postgres </h2>

```diff
+ Open the SQL Shell
# Enter info e.g username and password to connect to the Database
```

<em> :bangbang::bangbang::bangbang: All commands could have been run with a script :bangbang::bangbang::bangbang:</em>

<h3> Create database Matcha: </h3>

```diff
# CREATE DATABASE matcha;
```

<h3> Connect to Matcha: </h3>

```diff
# \c matcha;
```

<h3> Create tables: </h3> 

```diff
# CREATE TABLE users (id serial PRIMARY KEY, firstname VARCHAR (100), lastname VARCHAR (100), username VARCHAR (100), email TEXT UNIQUE NOT NULL, photourl TEXT, img1 TEXT, img2 TEXT, img3 TEXT, img4 TEXT, gender VARCHAR (20), sexpref VARCHAR (20), age SMALLINT, bio TEXT, city TEXT, tags TEXT [], longi FLOAT, lati FLOAT, popularity SMALLINT, logged_time TIMESTAMP, is_logged_in BOOLEAN, active BOOLEAN, secrettoken TEXT);
+ CREATE TABLE views (id serial PRIMARY KEY, viewer TEXT, viewed TEXT);
# CREATE TABLE login (id serial PRIMARY KEY, hash VARCHAR (100) NOT NULL, email TEXT UNIQUE NOT NULL);
# CREATE TABLE likes (id serial PRIMARY KEY, liker TEXT, liked TEXT, liketype SMALLINT);
+ CREATE TABLE matches (id serial PRIMARY KEY, user1 TEXT, user2 TEXT);
# CREATE TABLE chats (id serial PRIMARY KEY, sender TEXT, receiver TEXT, message TEXT, time_ TIMESTAMP);
```

<h3> Exit: </h3>

```diff
# \q;
```

<hr />

<h2> Set Up Project </h2>

<h3> Clone Project: </h3>

<em>To clone:</em> [Go to matcha project!](https://github.com/azuluGithub/matcha_revised)

<h3> Starting Project: </h3>

<h4> Navigate to back-end folder: </h4>

<ul>
   <li>
      <em>
        Create a 
        <strong>
          .env 
        </strong>
        file at root of the directory which should contain api keys:
       </em>
    </li>
    
```diff
- .env file below contains api keys for:
- 1) cloudinary database
- 2) postgres database
- 3) gmail logins
- (to use gmail to send : Enable less secure apps to access Gmail )
```

<h4> Save this file as .env :arrow_down_small::arrow_down_small::arrow_down_small: </h4>
    
```diff
# CLOUD_NAME = '**************************'
# API_KEY = '******************'
# API_SECRET = '***********************'

# HOST = '127.0.0.1'
# USER = '***********************'
# PASSWORD = '**********************'
# DATABASE = 'matcha'

# GMAIL_USER = '***********@gmail.com'
# GMAIL_PASS = '**************'
```

   <li>
      <em>
        Start server by running the following command:
       </em>
    </li>
    
```diff
# npm i && npm start
# (to run successfully your port must be 3000)
```
</ul>

<h4> Use another tab to Navigate to font-end folder: </h4>

<ul>
   <li>
      <em>
        Run the following command:
       </em>
    </li>
    
```diff
# npm i && npm start
# (to run successfully your port must be 3001)
```
</ul>

<h4> :grinning: :grinning: :grinning: :grinning: :grinning: HAPPY HACKING!!!!!!!! :grinning: :grinning: :grinning: :grinning: :grinning: </h4>

<hr />
<hr />

<h2>Pictures</h2>

<h4> Desktop Dashboard </h4>

![ddashboard image](/front_end/screenshots/dash_web.JPG)

<hr />

<h4> Mobile Dashboard </h4>

![mdashboard image](/front_end/screenshots/dash_mob.JPG)

<hr />

<h4> Profile </h4>

![profile image](/front_end/screenshots/prof_mob.JPG)

<hr />

<h4> Chat </h4>

![chat image](/front_end/screenshots/chat_mob.JPG)

<hr />

<h4> Other Users </h4>

![user image](/front_end/screenshots/user_mob.JPG)

<hr />