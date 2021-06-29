/* eslint-disable */
const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
admin.initializeApp();
const authMiddleware = require('./authMiddleware');
const userApp = express();

userApp.use(authMiddleware);

const db = admin.firestore();
const nodemailer = require("nodemailer"); //sirve para crear el transport que se va a encargar de enviar el correo electronico

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

//cloud function
exports.welcomeMail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  const name = user.name;
  return mailTransport.sendMail({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "test",
    html:
      `<h1>Hola ${name} </h1>
       <p>Esto es una prueba</p> `,
  })
	.then(res => console.log(res))
	.catch(error => error);
});

// cloud function
exports.goodbyeEmail = functions.auth.user().onDelete((user) => {
    const email = user.email;
    const name = user.name;
    return sendGoodbyeMail(email, name);
});

//aux function
async function sendGoodbyeMail(email, name) {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
    };
    mailOptions.subject = `Adios`
    mailOptions.text = `test despedida ${ name }`;
    await mailTransport.sendMail(mailOptions);
    functions.logger.log('se elimino el email: ', email);
    return null;
}


exports.onUserCreate = functions.firestore.document('users/{userId}').onCreate(async (snap, context) => {
  const values = snap.data();
  // send email
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

//Crea nuevos usuarios
userApp.post("/", async (request, response) => {
  
  const user = request.body;

  await db.collection("users").add(user);

  response.status(201).send();
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
// const cors = require("cors");
// const { body, validationResult } = require("express-validator");

// const nodemailer = require("nodemailer"); //sirve para crear el transport que se va a encargar de enviar el correo electronico
// userApp.use(cors({ origin: true }));


// //aux function
// function sendWelcomeMail(email, name) {
//   return 
// }


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
//     user: process.env.SENDER_EMAIL,
//     pass: process.env.SENDER_PASSWORD,
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

// const {SENDER_EMAIL, SENDER_PASSWORD} = process.env;

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
//           user: SENDER_EMAIL,
//           pass: SENDER_PASSWORD,
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


// ---------------------------------------------------------------------------------------------------




// ---------------------------------------------------------------------------------------------------



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
