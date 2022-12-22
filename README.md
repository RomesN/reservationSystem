# 1. Project's Title

Reservation app

# 2. Project Description

The goal of this project is to create a web application serving as a reservation system for beauty procedures.

## Backend

-   Javascript
-   Node.js
-   Express

### Project database

As database system was chosen object-relational database system PostgreSQL.

Data is divided into 7 tables:

-   admin - used for storing admin data, currently only one admin account is seeded at application start,
-   customers - used for storing customer data connected to reservations,
-   restrictions - used for storing reservation hours-related constraints such as opening hours, breaks of one-off closures,
-   restriction_type - enum table connected to restrictions,
-   services - used for storing info about services that a customer can book for currently seeded at application start,
-   statuses - enum table currently mainly connected to reservations.

ORM Sequelize was used on the backend to make work easier with the database system.

### Backend structure

REST API with three-tier architecture Controller <-> Service <-> Repository.

-   repositories - one repository per every non-enum database table,
-   services - one service per every repository storing logic predominantly connected to the corresponding model entity + additional notification service sending emails via nodemailer,
-   controllers - calling services and either sending responses or catching error thrown by services which are subsequently sent to errors handling middleware,

-   routers - route handlers,
-   middlewares - above-mentioned error handling middleware and token authentication middleware which verifies the validity of JWT access token which is expected to be received as a cookie for private admin routes,
-   model - sequelize model definition,
-   utils - helper functions, classes, and enums used in various locations.

### Other

Other handy dependencies and their project usage which were used and not mentioned above:

-   date-fns - used for various date operations,
-   bcrypt - used for password encryption and verification,
-   node-schedule - used for scheduling deletion of data from the database as for example reservations that were in past,
-   ical-generator - for sending an event via mail,
-   jsonwebtoken - for generating jwt token,
-   chalk - beautifying printed messages and errors,
-   cors - allowing cross-origin resource sharing,
-   dotenv - allowing import of env variables, so the application can be set differently for different environments.

## Frontend

-   Typescript
-   React.js

### Frontend structure

-   index.tsx - containing whole app and whole app wrappers,
-   App.tsx - containing all the routes and their corresponding components,
-   pages - entry point components for every route used in the App.tsx, in case component logic is not complex it can be also the last component in the corresponding branch tree, it is furthermore divided into folders according to route affiliation (user/admin),
-   components - components of separate routes, on the highest level devided into folders according to pages/routes,
-   api - axios instances and all methods for calling the backend used by pages and components,
-   hooks - custom hook for the entire project, in this project the folder contains two custom hooks that use useContext inside, so they are used for supplying its child components with data,
-   shared - types, helper functions or enums used in various locations,
-   assets - media used in the application, currently only the background image.
-   styles - all css styles applied containing three folders:
    -   general: styles for generally used components, or files used in index.tsx,
    -   admin: module css files for components/pages of the admin routes,
    -   user: module css files for components/pages of the user routes.

### Other

Other handy dependencies and their project usage which were used and not mentioned above:

-   react-router-dom - routing,
-   axios - used for API calls,
-   react-query - for managing, caching and syncing data in certain places of the application,
-   react-hook-form - reducing the amount of code written for admin login,
-   fontawesome - providing some icons,
-   boostrap - rarely used, but sometimes giving more control over forms or saving work of writing additional css styling,
-   react-datetime-picker/react-time-picker - providing good looking pickers and unifying input format,
-   date-fns - used for various date operations,
-   seetalert2 - providing cool looking popups.

## 3. EXAMPLE - WORK IN PROGRESS

https://user-images.githubusercontent.com/81518313/206234773-283b891d-7d04-4891-9731-fbbdf68d83b1.mp4

https://user-images.githubusercontent.com/81518313/206233975-d9596754-a759-4de3-a79e-8f3f8d201820.mp4

## 4. How to Install and Run the Project

Copy .env.example as .env then replace the settings in the .env file.
Use the following commands:

-   `npm install` - install the dependencies

-   `npm start` - start your app in dev mode

-   `npm test` - start your test

## 4. Credits

Author: Roman Nemeth
