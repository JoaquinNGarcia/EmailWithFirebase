/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer"); //sirve para crear el transport que se va a encargar de enviar el correo electronico
const express = require("express");
const cors = require("cors");
admin.initializeApp();
const db = admin.firestore();
const userApp = express();
userApp.use(cors({ origin: true }));

const REACT_APP_SENDER_EMAIL="joaquingarcia7596@gmail.com"
const REACT_APP_SENDER_PASSWORD="j39290658garcia7"

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

exports.onUserCreate = functions.firestore.document('users/{userId}').onCreate(async (snap, context) => {
  const values = snap.data();
  await db.collection('logging').add({ description: `El correo electrónico fue enviado al usuario: ${values.username}` });
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

//Crea nuevos usuarios y les envia un mail
userApp.post("/", async (request, response) => {
  const { body } = request;
  const user = body;
  const isValidMessage = body.message && body.to && body.subject;

  !isValidMessage && response.status(400).send({ message: "invalid request" });

  const mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: REACT_APP_SENDER_EMAIL,
      pass: REACT_APP_SENDER_PASSWORD,
    }
  });

  const mailOptions = {
    from: "LanguageApp@mail.com",
    to: body.to,
    subject: body.subject,
    text: body.message
  };

  mailTransport.sendMail(mailOptions, (err, data) => {
    if (err) {
      return response.status(500).send({ message: "Error: " + err.message + "data: " + data });
    }
    return response.send({ message: "email sent" });
  });

  await db.collection("users").add(user);
  response.status(201).send({ message: "Created" });
});

//Obtener todos los usuarios
userApp.get("/", async (request, response) => {
  const snapshot = await db.collection("users").get();

  let users = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    users.push({ id, ...data });
  });

  response.status(200).send(JSON.stringify(users));
});

//Obtener un usuario en puntual con el id
userApp.get("/:id", async (request, response) => {
  const snapshot = await db
    .collection('users')
    .doc(request.params.id)
    .get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  response.status(200).send(JSON.stringify({id: userId, ...userData}));
});

//Actualiza un usuario puntual
userApp.put("/:id", async (request, response) => {
  const body = request.body;
  
  await db.collection('users').doc(request.params.id).update(body);
  
  response.status(200).send()
});

//Borra un usuario puntual
userApp.delete("/:id", async (request, response) => {
  await db.collection("users").doc(request.params.id).delete();
  
  response.status(200).send();
})

exports.user = functions.https.onRequest(userApp);

// ---------------------------------------------------------------------------------------------------

// userApp.use(authMiddleware);
// const authMiddleware = require('./authMiddleware'); //Funciona para el token
// const { body, validationResult } = require("express-validator");

// ---------------------------------------------------------------------------------------------------

// exports.mailer = functions.https.onRequest(userApp);

// //Crea nuevos usuarios
// userApp.post("/", async (request, response) => {
  
//   const user = request.body;

//   await db.collection("users").add(user);

//   response.status(201).send();
// });

// ---------------------------------------------------------------------------------------------------

// const userCreationValidators = [
//   body("email")
//     .notEmpty()
//     .withMessage("Email is required!")
//     .isEmail()
//     .withMessage("Email is invalid!"),
//   body("firstName").notEmpty(),
//   body("lastName").notEmpty(),
//   body("password").notEmpty().isLength({ min: 6 }),
// ];
// const errors = validationResult(request);
//   !errors.isEmpty() && response.status(400).json({ errors: errors.array() });

// ---------------------------------------------------------------------------------------------------
// cloud function
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

// ---------------------------------------------------------------------------------------------------

// const mailTransport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: REACT_APP_SENDER_EMAIL,
//     pass: REACT_APP_SENDER_PASSWORD,
//   },
// });

// //cloud function
// exports.welcomeMail = functions.auth.user().onCreate((user) => {
//   const email = user.email;
//   const name = user.name;
//   return sendWelcomeMail(email, name);
// });

// //aux function
// function sendWelcomeMail(email, name) {
//   return mailTransport.sendMail({
//     from: "Pepe <pepe@mail.com>",
//     to: email,
//     subject: "test",
//     html:
//       `<h1>Hola ${name} </h1>
//        <p>Esto es una prueba</p> `,
//   })
// 	.then(res => res)
// 	.catch(error => error);
// }

// ---------------------------------------------------------------------------------------------------

// //cloud function
// exports.welcomeMail = functions.auth.user().onCreate((user) => {
//   const email = user.email;
//   const name = user.name;
//   return sendWelcomeMail(email, name);
// });

// async function sendWelcomeMail(email, name) {
//   await mailTransport.sendMail({
//     from: "Pepe <pepe@mail.com>",
//     to: email,
//     subject: "test",
//     html:
//       `<h1>Hola ${name} </h1>
//        <p>Esto es una prueba</p> `,
//   });
//   functions.logger.log('New welcome email sent to:', email);
//   return null;
// }

// ---------------------------------------------------------------------------------------------------

//cloud function
// exports.goodbyeEmail = functions.auth.user().onDelete((user) => {
//     const email = user.email;
//     const name = user.name;
//     return sendGoodbyeMail(email, name);
// });

// async function sendGoodbyeMail(email, name) {
//     const mailOptions = {
//         from: "Pepe <pepe@mail.com>",
//         to: email,
//     };
//     mailOptions.subject = `Adios`
//     mailOptions.text = `test despedida ${ name }`;
//     await mailTransport.sendMail(mailOptions);
//     functions.logger.log('se elimino el email: ', email);
//     return null;
// }

// ---------------------------------------------------------------------------------------------------

// const nodemailer = require("nodemailer"); //sirve para crear el transport que se va a encargar de enviar el correo electronico
// require("dotenv").config();

// const {REACT_APP_SENDER_EMAIL, REACT_APP_SENDER_PASSWORD} = process.env;

// exports.sendEmailNotification=functions
//     .firestore
//     .document("submissions/{docId}")
//     .onCreate((snap, ctx) => {
//       const data=snap.data();
//       const authData = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//           user: REACT_APP_SENDER_EMAIL,
//           pass: REACT_APP_SENDER_PASSWORD,
//         },
//       });
//       authData.sendMail({
//         from: "info@languageapp.com",
//         to: `${data.email}`,
//         subject: "Tets",
//         text: `${data.email}`,
//         html: `${data.email}`,
//       }).then( (res) => {
//         console.log("successfully sent that mail").catch( ( err ) => {
//           console.log(err);
//         }
//         );
//       }
//       );
//     }
// );


// ---------------------------------------------------------------------------------------------------

// exports.sendEmail = functions.https.onRequest( (request, response) => {
//   console.log("sendEmail");
// });

// ---------------------------------------------------------------------------------------------------

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs", {structureData: true});
//   response.send("Hello from Firebase!");
// });

// ---------------------------------------------------------------------------------------------------

// exports.welcomeMail = functions.firestore.document('users/{userId}').onCreate(( snap ) => {
//   const { email } = user;
//   return sendWelcomeMail(email);
// });

// function sendWelcomeMail(email) {
//   return mailTransport.sendMail({
//     from: 'languageAppTest@languageApp.com',
//     to: email,
//   })
//   .then( res=> res)
//   .catch( error => error);
// }


// ---------------------------------------------------------------------------------------------------

// const mailTransport = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: REACT_APP_SENDER_EMAIL,
//     pass: REACT_APP_SENDER_PASSWORD,
//   }
// });

// // cloud function
// exports.welcomeMail = functions.auth.user().onCreate((user) => {
//   const { email } = user;
//   async function sendWelcomeMail(email) {
//     const mailDetails = {
//       from: REACT_APP_SENDER_EMAIL,
//       to: email,
//       subject: "test",
//       html:
//         `<h1>Hola </h1>
//         <p>Esto es una prueba</p> `,
//     };
//     await mailTransport.sendMail(mailDetails);
//     functions.logger.log('Nuevo email enviado a:', email);
//   }
//   return null;
// });


// // cloud function
// exports.goodbyeEmail = functions.auth.user().onDelete((user) => {
//   const { email, name } = user;
//   async function sendGoodbyeMail(email) {
//     const mailOptions = {
//         from: REACT_APP_SENDER_EMAIL,
//         to: email,
//         subject: `Adios`,
//     };
//     await mailTransport.sendMail(mailOptions);
//     functions.logger.log('se elimino el email: ', email);
//     return null;
// }

// } );

// ---------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------



// ---------------------------------------------------------------------------------------------------



// ---------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------
// admin.initializeApp(functions.config().firebase);

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
