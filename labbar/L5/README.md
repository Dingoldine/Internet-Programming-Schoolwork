# Lab5 node-angular
This is the setup reference for lab 5 in the IntNet course.
The setup focuses on showing all the basic features of Nodejs and Angular while keeping it quite small and easy to understand. While not everything is perfect in terms of how to structure Nodejs/Angular it is a very good basic structure to build smaller applications without having to do a major refactoring.

When molding this setup into the project of your desire it's very important that you work incrementally. Angular is not always known to be very nice in it's error messages and HTML parsers are quite terrible in figuring out where you made an error.

For those who wants to do the project in Node/Angular i heavily recommend that you do this lab properly since you will most likely be able to use this lab as a base for the project.

## Setup
To run this you need to:
1. git clone this project
2. install node, latest version should work (tested with 6.2.2)
3. run npm install
4. run npm start

## Structure
The code is split into 2 very distinct part: API:server (app) and front end (public).

#### API:server
Written in Nodejs this simplistic structure will last for a few hundred lines or so before you want to start breaking down controller and model into their own folders and files. The first one to be done should probably be to break down the model into one file per class.

**index.js:** This is the main file and is both the most and least important one. You probably won't need to touch it very much to complete the lab, but it is the core to understanding how everything works.

**model.js:** This is where the data-structures are defined and how the data is related.

**controller.js:** defines what is supposed to happen for all api requests that are sent through http. Most are simply for fetching data.

**socketController.js:** Defines what is supposed to happen for all "interactive" events where the client wants to reach other clients or when the server wants to contact a/all clients.


#### Client:
The client is written in angular and showcases the basic structure any angular project. Everything has been put in the same folder to lower the initial complexity.

**index.html:** This is similarly to the index.js in the back end the most important file, and also the one you will probably change the least. The important thing to notice here is that it contains the navbar (since it should always be there) and <div ng-view></div> which declares that this section should contain dynamically loaded html.

**app.js:** Defines how the modules are interconnected and currently also defines routing and what code to associate to what sub-page.

**controllers.js:** This is the meat of the logic for the client. Here all the functions, events, ajax-calls and what not are defined for the entire application. This should obviously be split up for a larger app, but is more than good enough for the labb.

**main.less:** CSS written in a language that is then compiled to CSS. This files hasn't gotten much love during the coding and might even contain dead code.

**\*.html:** These are the "views" of the client and contains information about what data should be mapped where and how to display it.

**services.js:** this is where a large part of the angular "magic" happens. Here we define globally accessible resources and define helper packages that is used throughout the application.
