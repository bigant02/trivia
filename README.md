# trivia app

refer from https://github.com/anihalaney/rwa-trivia

## Quick Installation Instructions

* Install cli globally (version should match the one in package.json)

`npm install -g @angular/cli@1.0.0`

* Install npm packages

`npm install`

* Setup your firebase instance @ https://firebase.google.com/

* Setup providers in Firebase Authentication

* Use the firebase configuration information and plug it in src/environment.ts

* Import src/db.json to your firebase database instance to get the initial set of test data

* Run the application using ng serve

`ng serve`

* Add yourself as a user using the application. Ensure you are added as a user in Authentication tab of firebase console.

* Add your user id as an admin in the firebase database (admins need to be added manually) -

Set: users/\<user id\>/roles/admin: true

* Use firebase-rules.json file to setup the firebase rules for your database

* Serve the application again. Ensure you have admin privileges

`ng serve`

## Deploy to Firebase Server

* Install firebase tools globally

`npm install -g firebase-tools`

* Authenticate with your firebase credentials

`firebase login`

* Setup firebase hosting configuration for the application, using "dist" instead of public as the public folder name

`firebase init`

* Create a build

`ng build`

* Serve up the app using firebase server locally

`firebase serve`

* Deploy Site to firebase

`firebase deploy --only hosting`

* Setup firebase functions - creates functions folder and installs dependencies

`firebase init`

* Deploy functions to firebase

`npm run deploy-functions`

## Testing
* Test the application using

`ng test`
