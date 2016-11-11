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

Now that you have an .env file setup you can install your dependencies for your api.

```
npm install
```

The api server is a node server that will generate the JWT Token for our application,
you can run the server using the following command:

```
npm start
```

It should start running on port 4000.

You can test the server endpoint by doing the following:

```
curl -X POST http://localhost:4000
```

You should get the following response:

```
{ todo: 'fetch token'}
```

Open the project in your favorite editor [https://atom.io/](https://atom.io/)

```
atom .
```

Open the `index.js` file.

What we want to do is to take our KEY and SECRET and make a POST /\_session call
to the medwise advisor matrix api.

So we want to replace:

```
return { todo: 'fetch token'}
```

with

```
return await fetch(process.env.URL + '/_session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    key: process.env.KEY,
    secret: process.env.SECRET
  })
}).then(res => res.json())
```

You can see we are using async/await promises and the fetch api to POST a
json document with key and secret set, then we are grabing the json() result and
sending it back to the user.

Once you made the changes, restart your server by pressing `ctrl-c` in the terminal
of the running server and relaunching it by typing `npm start`

Now if you open another terminal and run the curl commmand:

```
curl -X POST http://localhost:4000
```

You should see a new json document with a JWT Token.

Now that we have our api server running, lets move to the web app.

```
cd ..
cd web
```

Lets install all of the dependencies, (may take a while)

```
npm install
```

You can go ahead and open the app in an editor

```
atom .
```

And finally start your app using the start command

```
npm start
```

It should pop up a browser, but if it does not you can navigate chrome to
http://localhost:3000

---

In this app, we have the ability to add medications and allergies then we want
to get a token and then generate the matrix and apply it to an iframe.

---

In your editor open the src/App.js file and navigate to the getToken function.

In the get token function we want to call our little api server to get a JWT Token.

```
// Get token
fetch('http://localhost:4000', {
  method: 'POST'
})
.then(res => res.json())
.then(res => {
  console.log(res)
  this.setState({token: res.token})
})
```

If you go to your browser you should see a get token button, if you click it and
it enables the generate matrix button, you should be all set.  If you have problems
you may want to confirm your api server is running on http://localhost:4000

---

Next, we want to build our patient bundle and send the information to the matrix-api
and get back a url. We can do this by adding the following code to the generate matrix
function

```
const patientBundle = bundle(this.state.patient)
fetch(medwiseApi + '/matrix?token=' + this.state.token, {
  method: 'POST', body: JSON.stringify(patientBundle)})
  .then(res => res.json())
  .then(data => this.setState({
    matrix: data.url
  }))
```

This code passes the JWT Token and the patient bundle that is created from the
create-bundle.js module in your src folder.

Once this is saved, go to your browser and click get token then click generate matrix,
and you should see the matrix load in an iframe.

The create-bundle module converts a list of RxNorm Medications and Allergies into
the HL7 FHIR bundle format.

 
