import React, {
	useEffect,
	useState
} from 'react';
// eslint-disable-next-line
// import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/authContext";
import {
	BrowserRouter as Router,
	Switch,
	Route
	// Link
} from "react-router-dom";
import { useSelector } from "react-redux";

import Mail from "../components/Mail/Mail";
import EmailList from "../components/EmailList/EmailList";
import SendMail from "../components/SendMail/SendMail";

import Login from "../components/Login/login";
import Signup from "../components/Signup/signup";
import PrivateRoute from "../components/PrivateRoute/privateRoute";
import ForgotPassword from "../components/ForgotPassword/forgotPassword";
import UpdateProfile from "../components/UpdateProfile/updateProfile";

import { selectSendMessageIsOpen } from "../features/mailSlice";
import { selectUser } from "../features/userSlice";
import {
//   db,
  auth
} from "../../config/firebaseApp";


// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const App = () => {
	const [firebaseUser, setFirebaseUser] = useState(true);

	const sendMessageIsOpen = useSelector(selectSendMessageIsOpen);
	console.log('sendMessageIsOpen: ', sendMessageIsOpen);
	const user = useSelector(selectUser);
	console.log("user: ", user);
	 
  	const [emails, setEmails] = useState([]);
	console.log("emails: ", emails);
	useEffect(() => {
		auth.onAuthStateChanged(user => {
			user ? setFirebaseUser(user) : setFirebaseUser(null);
		})

	}, []);

	return (
		firebaseUser !== false ? (
			<div className="d-inherit w-180" style={{ maxWidth: "center" }}>
				<Router>
					<AuthProvider>
						<Switch>
							<Route path="/signup" component={ Signup } />
							<Route path="/login" component={ Login } />
							<Route path="/forgotPassword" component={ ForgotPassword } />
							<Route path="/mail" component={ Mail } />
							
							<PrivateRoute path="/updateProfile" component={ UpdateProfile } />
							<PrivateRoute exact path="/">
								<EmailList emails={emails} />
							</PrivateRoute>
						</Switch>
						{sendMessageIsOpen && <SendMail />}
					</AuthProvider>
				</Router>
			</div>
		) : (
			<div>
				Cargando...
			</div>
		)
	);
}

export default App;
