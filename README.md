# About
This is Metagram REST API. It's the backend for Metagram, a cloud application that I built as part of the the Udacity Cloud Engineering Nanodegree.

## Setup
You need to have [Node.js 12+](https://nodejs.org/en/), [Yarn](https://yarnpkg.com/) and [Git](https://git-scm.com/) installed in order to run this app. You also need a live instance of a [Postgres](https://www.postgresql.org/) database for the app's use.
- Open a terminal/command prompt.
- Clone this repository using:
```bash
git clone https://github.com/folushooladipo/metagram-api.git
```
- Install the project's dependencies by entering this command in the terminal:
```bash
yarn
```
- Have an instance of Postgres running (either locally or in the cloud) and get connection details to that instance.
- Open `.env.sample`, make a copy of it, save that copy as `.env`, remove all the comments in it and supply values to its list of environment variables.
- Run the command below to start the app's server:
```bash
yarn dev
```
- The app will be available at `http://localhost:8080`

## Making requests
I have included a Postman collection in the root directory that contains all requests and info about what they need to run (tokens, API keys) etc. The collection is `./metagram-restapi.postman_collection.json`.

## Useful tools
#### 1. [Postbird](https://github.com/paxa/postbird)
Postbird is a useful client GUI (graphical user interface) to interact with our provisioned Postgres database. We can establish a remote connection and complete actions like viewing data and changing schema (tables, columns, ect).

#### 2. [Postman](https://www.getpostman.com/downloads/)
Postman is a useful tool to issue and save requests. Postman can create GET, PUT, POST, etc. requests complete with bodies. It can also be used to test endpoints automatically. I've included a collection (`./metagram-restapi.postman_collection.json`) that contains sample requests.
