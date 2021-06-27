/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const db = admin.firestore();

const userApp = express();

userApp.use(cors({ origin: true }));

//Devuelve todos los usuarios
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

//Devuelve un usuario en puntual con el id
userApp.get("/:id", async (request, response) => {
    const snapshot = await db.collection('users').doc(request.params.id).get();

    const userId = snapshot.id;
    const userData = snapshot.data();

    response.status(200).send(JSON.stringify({id: userId, ...userData}));
})

userApp.post("/", async (request, response) => {
  const user = request.body;

  await db.collection("users").add(user);

  response.status(201).send();
});

userApp.put("/:id", async (request, response) => {
    const body = request.body;

    await db.collection('users').doc(request.params.id).update(body);

    response.status(200).send()
});

userApp.delete("/:id", async (request, response) => {
    await db.collection("users").doc(request.params.id).delete();

    response.status(200).send();
})

exports.user = functions.https.onRequest(userApp);