/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();

app.use(cors({ origin: true }));

module.exports = {
    ...require('./controllers/user')
}

exports.onUserCreate = functions.firestore.document('users/{userId}').onCreate(async (snap, context) => {
    const values = snap.data();
    // send email
    await db.collection('logging').add({ description: `Email was sent to user with username:${values.username}` });
})

exports.onUserUpdate = functions.firestore.document('users/{userId}').onUpdate(async (snap, context) => {
    const newValues = snap.after.data();
    const previousValues = snap.before.data();
    if (newValues.username !== previousValues.username) {
        const snapshot = await db.collection('reviews').where('username', '==', previousValues.username).get();
        let updatePromises = [];
        snapshot.forEach(doc => {
            updatePromises.push(db.collection('reviews').doc(doc.id).update({ username: newValues.username }));
        });
        await Promise.all(updatePromises);
    }
})

exports.onPostDelete = functions.firestore.document('posts/{postId}').onDelete(async (snap, context) => {
    const deletedPost = snap.data();
    let deletePromises = [];
    const bucket = admin.storage().bucket();
    deletedPost.images.forEach(image => {
        deletePromises.push(bucket.file(image).delete());
    });
    await Promise.all(deletePromises);
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs", {structureData: true});
  response.send("Hello from Firebase!");
});

exports.sendEmail = functions.https.onRequest( (request, response) => {
      console.log("sendEmail");
    });



// ---------------------------------------------------------------------------------------------------




// ---------------------------------------------------------------------------------------------------




// ---------------------------------------------------------------------------------------------------

// const nodemailer = require("nodemailer");

// import * as functions from 'firebase-functions'; //probando

// admin.initializeApp(functions.config().firebase);

// const mailTransport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "joaquingarcia7596@gmail.com",
//     pass: "J39290658garcia7",
//   },
// });

// exports.welcomeMail = functions.auth.user().onCreate((user) => {
//   const email = user.email;
//   const name = user.name;
//   return mailTransport.sendMail({
//     from: "Pepe <pepe@mail.com>",
//     to: email,
//     subject: "test",
//     html:
//       `<h1>Hola ${name} </h1>
//        <p>Esto es una prueba</p> `,
//   });
// });


// const createNotification = ((notification) => {
//   return db.collection("notifications")
//       .add(notification)
//       .then( (doc) => console.log("notification added", doc));
// });

// exports.userJoined = functions.auth.user().onCreate( (user) => {
//   return db.collection( "users" )
//       .doc(user.uid).get().then( (doc) => {
//         const newUser = doc.data();
//         const notification = {
//           content: "Joined the party",
//           user: `${newUser.firstName} ${newUser.lastName}`,
//           time: admin.firestore.FieldValue.serverTimestamp(),
//         };

//         return createNotification(notification);
//       });
// });
