const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const admin = require("firebase-admin");
admin.initializeApp();

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "joaquingarcia7596@gmail.com",
    pass: "J39290658garcia7",
  },
});

exports.welcomeMail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const name = user.name;
  return mailTransport.sendMail({
    from: "Pepe <pepe@mail.com>",
    to: email,
    subject: "test",
    html:
      `<h1>Hola ${name} </h1>
       <p>Esto es una prueba</p> `,
  });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});


const createNotification = ((notification) => {
  return admin.firestore().collection("notifications")
      .add(notification)
      .then( (doc) => console.log("notification added", doc));
});

exports.userJoined = functions.auth.user().onCreate( (user) => {
  return admin.firestore().collection( "users" )
      .doc(user.uid).get().then( (doc) => {
        const newUser = doc.data();
        const notification = {
          content: "Joined the party",
          user: `${newUser.firstName} ${newUser.lastName}`,
          time: admin.firestore.FieldValue.serverTimestamp(),
        };

        return createNotification(notification);
      });
});
