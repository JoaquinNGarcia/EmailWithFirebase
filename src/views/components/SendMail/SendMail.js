import React from "react";
import "./SendMail.css";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { closeSendMessage } from "../../features/mailSlice";
import { db } from "../../../config/firebaseApp";
import firebase from "firebase";

function SendMail() {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (formData) => {
    console.log('se disparo');
    
    console.log(formData);
    db.collection("emails").add({
      to: formData.to,
      message: formData.message,
      subject: formData.subject,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    const requestOptions = {
			method: 'POST',
			body: JSON.stringify({
        subject: formData.subject,
        message: formData.message,
				to: formData.to,
			}),
      headers:{
        "Content-type": "application/json"
      }
		};
		fetch('https://us-central1-languageapp-4985f.cloudfunctions.net/mailer', requestOptions )
			.then(async response => {
				const data = await response.json();
				if(!response.ok) {
					return Promise.reject( (data && data.message) || response.status ) //error
				}
			})
			.catch( error => {
				// setErrorMessage(error.toString());
				console.log('Error: ', error);
			});

    dispatch(closeSendMessage());
  };

  return (
    <div className="sendMail">
      <div className="sendMail-header">
        <h3>New Message</h3>
        <CloseIcon
          onClick={() => dispatch(closeSendMessage())}
          className="sendMail-close"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="to"
          placeholder="Para"
          type="email"
          {...register("to", { required: true })}
        />
        {errors.to && <p className="sendMail-error">Destinatario es requerido!</p>}
        <input
          name="subject"
          placeholder="Asunto"
          type="text"
          {...register("subject", { required: true })}
        />
        {errors.subject && (
          <p className="sendMail-error">Asunto es requerido!</p>
        )}
        <input
          name="message"
          placeholder="Mensaje"
          type="text"
          className="sendMail-message"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <p className="sendMail-error">Mensaje es requerido!</p>
        )}
        <div className="sendMail-options">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="sendMail-send"
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SendMail;
