import React, {
	useEffect,
	useState
} from 'react';
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/authContext";
import {
	BrowserRouter as Router,
	Switch,
	Route
	// Link
} from "react-router-dom";
import Navbar from '../containers/Navbar/navbar';
// import Admin from '../containers/Admin/admin'
import Signup from "../containers/Signup/signup";
import Dashboard from "../containers/Dashboard/dashboard";
import Login from "../containers/Login/login";
import PrivateRoute from "../containers/PrivateRoute/privateRoute";
import ForgotPassword from "../containers/ForgotPassword/forgotPassword";
import UpdateProfile from "../containers/UpdateProfile/updateProfile";

import { auth } from '../../config/firebaseApp';

// import firebaseApp from './config/firebaseApp';
// import Login from './Login'; //login sin diseño
// import Login from './views/containers/Login/Login'; //login con diseño
// import Home from './Home.js';
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
// import { FacebookLoginButton } from 'react-social-login-buttons';

const App = () => {
	const [firebaseUser, setFirebaseUser] = useState(true);

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			// console.log('App - user: ', user);
			user ? setFirebaseUser(user) : setFirebaseUser(null);
		})
	}, [])
	return (
		firebaseUser !== false ? (
			<div className="d-inherit w-180" style={{ maxWidth: "center" }}>
				<Router>
					<Navbar firebaseUser={firebaseUser}/>
					{/* <Container
						className="d-flex align-items-center justify-content-center"
						style={{ minHeight: "100vh" }} >		 */}
						{/* <div className="w-100" style={{ maxWidth: "400px" }}> */}
						<AuthProvider>
							<Switch>
								<Route path="/signup" component={ Signup } />
								<Route path="/login" component={ Login } />
								{/* <Route path="/admin" component={ Admin } /> */}
								<Route path="/forgotPassword" component={ ForgotPassword } />
								<PrivateRoute path="/updateProfile" component={ UpdateProfile } />
								<PrivateRoute exact path="/" component={ Dashboard } />
							</Switch>
						</AuthProvider>
						{/* </div> */}
					{/* </Container> */}
				</Router>
			</div>
		) : (
			<div>
				Cargando...
			</div>
		)
	)
}

export default App;

// class App extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			// alert: false,
// 			// alertData: {},
// 			// form: [],
// 			user: null
// 		};
// 	}

// 	// // Mostrar una alerta cuando se envia el formulario
// 	// showAlert(type, message) {
// 	// 	this.setState({
// 	// 		alert: true,
// 	// 		alertData: { type, message }
// 	// 	});
// 	// 	setTimeout(() => {
// 	// 		this.setState({ alert: false });
// 	// 	}, 4000)
// 	// }

// 	// // Con esta funcion borramos todos los elementos del formulario
// 	// resetForm() {
// 	// 	this.refs.contactForm.reset();
// 	// }

// 	// // Funcion para enviar la informacion del formulario a Firebase Database
// 	// sendMessage(e) {
	
// 	// 		// Detiene la acción predeterminada del elemento
// 	// 		e.preventDefault();

// 	// 		// Creamos un objeto con los valores obtenidos de los inputs
// 	// 		const params = {
// 	// 			name: this.inputName.value,
// 	// 			email: this.inputEmail.value,
// 	// 			city: this.inputCity.value,
// 	// 			phone: this.inputPhone.value,
// 	// 			message: this.textAreaMessage.value
// 	// 		};

// 	// 		// Validamos que no se encuentren vacios los principales elementos de nuestro formulario
// 	// 		if (params.name && params.email && params.phone && params.phone && params.message) {
// 	// 			// enviamos nuestro objeto "params" a firebase database
// 	// 			firebaseConf.database().ref('form').push(params)
// 	// 				.then(() => {
// 	// 					// Si todo es correcto, actualizamos nuestro estado para mostrar una alerta.
// 	// 					this.showAlert('success', 'Your message was sent successfull');
// 	// 				})
// 	// 				.catch(() => {
// 	// 					// Si ha ocurrido un error, actualizamos nuestro estado para mostrar el error 
// 	// 					this.showAlert('danger', 'Your message could not be sent');
// 	// 				});
				
// 	// 				// limpiamos nuestro formulario llamando la funcion resetform
// 	// 			this.resetForm();
// 	// 		} else {
// 	// 			// En caso de no llenar los elementos necesario despliega un mensaje de alerta
// 	// 			this.showAlert('warning', 'Please fill the form');
// 	// 		};
// 	// }


// 	componentDidMount() {
// 		this.authListener();
// 	}

// 	authListener = () => {
// 		firebaseApp.auth().onAuthStateChanged((user) => {
// 			user ? this.setState({ user }) : this.setState({ user: null });
// 		})
// 	}

// 	render() {
// 		return (
// 			<div className="App">
// 				{ this.state.user ? ( <Home /> ) : ( <Login /> ) }
// 			</div>
// 		);
//   }
// }

