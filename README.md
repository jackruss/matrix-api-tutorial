# Matrix API Tutorial

This tutorial is a quick walk through on how to interact with
the Medwise Advisor API and specifically the Medication Risk Mitigation Matrix. This api makes it easy to embed the Matrix
in any web view.

We will be using `JavaScript` on both the front end and back end of this project to connect to the API and serve the matrix. We will also be using the REST API of RxNorm to add medications and allergies. Do not use the RxNorm API in production, sign up for their database and incorporate it into your infrastructure.

## Getting Started

First we need to install a couple of things:

* Git - https://git-scm.com/
* NodeJS - https://nodejs.org

After installing nodejs you will have a tool on your command line, called npm. We will use it to setup our projects and environment.

Open you console or terminal and type

``` sh
git clone https://github.com/jackruss/matrix-api-tutorial.git
```

Next cd into the new directory:

``` sh
cd matrix-api-tutorial
```

You should see two folders, api and web.

The api folder will contain the api call that will generate your JWT Token from the Medwise Advisor API.

Then the web application will be your app that allows you to add
medications and allergies and generate a matrix.

You should have received a development key and secret in your signup for the matrix api, if not, please contact trhc.com.

Once you have the key and secret, you want to create a new file in the api directory.

```
cd api
touch .env
echo KEY=[your key] >> .env
echo SECRET=[your secret] >> .env
echo URL=https://matrix-api-staging.medwiseadvisor.com
```
