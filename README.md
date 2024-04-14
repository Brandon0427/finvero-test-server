# Nest.js Backend Example Server

## Description

This repository contains the codebase for a backend server built using Nest.js, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

## Features

- **Modular Architecture**: Utilizes Nest.js' modular architecture for organized and maintainable codebase.
- **Dependency Injection**: Leverages Nest.js' powerful dependency injection system for flexible and testable components.
- **RESTful APIs:**: Implements RESTful APIs for seamless communication with client applications.
- **Middleware Integration**: Includes middleware for handling authentication, logging, error handling, etc.
- **Database Integration**: Integrates with various databases such as MongoDB, MySQL, PostgreSQL, etc.
- **Swagger Documentation**: Auto-generates API documentation using Swagger/OpenAPI specification.
- **Validation**: Implements validation for incoming requests using decorators and Pipes.
- **Testing**: Includes unit and integration tests for ensuring code quality and reliability.

## Technologies used

### Node.js

- Nest.js
- Prisma
- Passport
- Pactum
- e2e

### Typescript

- Procedural Programming Paradigm
- Object-Oriented Programming Paradigm

## Getting Started

1.  Open your preferred command line interface (CLI).

2.  Clone the project with:

* * *

>       git clone 'https://github.com/Capital-Zen/Belvo-Microservice-Server.git'

* * *
    
3.  Execute the following command to download all the dependencies and update the package-lock.json:
* * *

>       npm i

* * *
    
4.  Head to the root of the directory of this project and create a .env file.
    
5.  Inside the .env file add the following secrets (you must sustitute to the actual values):

*Postgres Database URL*
- DATABASE_URL=xxxxxxxxxx
- JWT_SECRET=xxxxxxxxxx

6.  Inside the .env.test file add the following secrets (you must sustitute to the actual values):

*Postgres Database URL*
- DATABASE_URL=xxxxxxxxxx
- JWT_SECRET=xxxxxxxxxx

## Launching the project

### Local Execution

1.  Start the Dev Docker Image Database.
    *The original code of the server will execute on **localhost:5434***

- New Docker Container Creation Start (will not preserve previosuly saved data).
* * *

>       docker compose up dev-db -d

* * *

- Force New Docker Container Restart (will not preserve previously saved data).
* * *

>       npm run db:dev:restart

* * *

- Restart Docker Container (will preserve previosuly saved data).
* * *

>       docker stop <ContainerID>
>       docker start <ContainerID>

* * *

2.  Run the Prisma Studio Server.
    *The original code of the server will execute on **localhost:5555***
    *If **npm run db:dev:restart** was run previously, this step is not required.*

* * *

>       npx prisma studio

* * *

3.  Run the Nest.js Server.
    *The original code of the server will execute on **localhost:5005***

* * *

>       npm run start:dev

* * *

### Local Testing

1.  Initialize End-To-End tests.

* * *

>       npm run test:e2e

* * *

2.  Initialize Prisma Testing Server.

* * *

>       npx dotenv -e .env.test -- prisma studio

* * *

1.  Rerun all test End-To-End tests.

* * *

>       a

* * *

* * *

>       ENTER ↵

* * *

## Updating the project

1.  Open your preferred Command Line Interface (CLI).
2.  Change to *main* branch of the project:

* * *

>       git checkout main

* * *

3.  Update the project with the latest changes on *main* or the most updated branch:

* * *

>       git pull origin main

* * *

4.  Create a **new branch** out of the *main* branch:

* * *

>       git checkout -b <new-branch-name>

* * *

5.  Hackerman time!
6.  Commit the changes locally with:

* * *

>       git add .
>       git commit -m "Hackerman changes made to the branch!"

* * *

7.  Push the changes of your **new branch** to the project:

* * *

>       git push -u origin <new-branch-name>

* * *

## Project status

Main branch of the project is currently being developed.

## Useful Commands

- Creating the Controller of a Module without Additional Configuration.

* * *

>       nest g controller <path> --no-spec

* * *

- List Active Docker Containers.

* * *

>       docker ps

* * *

- List All Docker Containers (including stopped ones).

* * *

>       docker ps -a

* * *

## Sources

### Nest.js

- [Nest.js Documentation](https://nestjs.com/)

### Prisma

- [Prisma Documentation](https://www.prisma.io/)

### GitHub

- [README Syntax Documentation](https://github.com/ricval/Documentacion/blob/master/Markdown/daringfireball/syntax.md?plain=1)
