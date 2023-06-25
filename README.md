# P1 - Angular Object Database for Pure Data

## Introduction

Pure Data is a visual dataflow programming environment for dsp, sound design, and electronic music. https://puredata.info/. This is an interface to a common database of pure data objects and libraries. The database will contain info about objects such as what library they're in, and users can search by object name or list the objects in a library.

## User Stories

- **As a user**,  I want to register an account so that I can have a personalized browsing experience.
- **As a user**, I want to log in to my account so that I can add objects and libraries to the database.
- **As a user**, I want to create/edit descriptions for libraries and objects only when logged in.
- **As a user**, I want to browse through objects and libraries.
- **As a user**, I want to search libraries and objects by name
- **As a user**, I want to leave comments on objects regarding their use and implementation
- **As a user**, I want to search objects by tag/category
- **As a user**, I want to add a profile picture that can be viewed by other users
- **As a user**, I want a list of libraries and objects recommended to me based on my previous view history.

## MVP (Minimum Viable Product)

- User registration and login
- Browsing libraries and objects
- Adding objects and libraries to the database
- ability to update library to new version from puredata.info text files/deken
- search by object or library name, or tag
- Modifying an object and/or library
- Per-object Comments
- allow users to query latest version from puredata.info/deken in order to update objects or create libraries.
- User has a profile with an optional picture and recommendations

## Stretch Goals

- Generate Dependency Tree for each object and/or library
- Import object/library data from .md file
- ability of server to download library and update names from object files. (potentially dealing w/ single-binary libraries and/or -meta.pd files)
- add objects from .txt file
- ability to add tags to search by
- search by author
- "following" activity in a library & receiving notifications
- link to library source code

## Tech Stacks

- **Java**: The main programming language used for building the application on the server.
- **PostgreSQL**: Used as the database to store user, object, and library data.
- **Maven**: Used for managing project dependencies.
- **Spring Boot**: Application Framework for creating web server backend and logging.
- **Angular and Typescript**: Used for displaying the site and client-side interaction.
- **Spring Data JPA**: Represents entity & data access layer.
- **BCrypt**: A Java library for hashing and checking passwords for security.
- **JUnit and Mockito/Spring-Boot-Test**: Used for unit and integration testing.
- **Log4j**: A logging utility for debugging purposes.
- **Git and GitHub**: Used for version control.
- **Amazon Web Services (AWS)**: Will be used for hosting the application and the database, and managing other services like Lambda, S3, etc.
- **Hibernate**: For object-relational mapping (ORM), allowing Java to interact with the database in an object-oriented manner.

## Running
    The frontend is built in Angular. Run "ng serve" from the project's root folder from a terminal to run (on port 4200). The backend urls can be configured in the 'environments' folder.

    There is also a s3 bucket used for storing profile pictures. When a picture is saved, it is sent to the backend where it is scaled before being sent to the bucket. The url must match between where the backend sends the file and where the frontend fetches it. (also set in environments)

## Usage
    Without signing up, users can view and search for libraries and objects by name or tag. Clicking on the name of an entry in the "Libraries" or "Library" tables will take the user to that library or object page.

    In order to Sign Up, go to the "login" page and press "create an account".
    After logging in with the new credentials, you can view and edit your own profile, edit libraries and objects, and 'star' libraries or objects.

    'Starring' will cause the recommendation system to use the starred object's tags to generate recommendations on the user's profile page.

    In order to edit an object or library, click 'edit' on its page. You can also add a new library or object from the 'libraries' and 'library' pages respectively. On the edit pages you can add tags by selecting them from the scrollbox and clicking the '+' button. In order to add a new global tag click the 'Add' button.