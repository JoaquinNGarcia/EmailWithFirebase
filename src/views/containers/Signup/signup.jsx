import React,
	{
		useEffect,
		useRef,
		useState
	} from 'react';
import {
	Alert,
	Button,
	Card,
	Form,
	FormGroup
} from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import {
	Link,
	useHistory
} from "react-router-dom";
import Dashboard from '../Dashboard/dashboard';
import { db } from '../../../config/firebaseApp';

// import { postMailer } from '../../service/shared/onUserCreate.service'

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
	// const isTeacherRef = useRef();

    const { signup } = useAuth();
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
	const [ selectedAccountType, setSelectedAccountType ] = useState(false);
	const [ accountProfile, setAccountProfile ] = useState('');
	const [ associatedEmail, setAssociatedEmail ] = useState('');
    const history = useHistory();

	// const [ postId, setPostId ] = useState(null);
	// const [ errorMessage, setErrorMessage ] = useState(null);

	useEffect( () => {
		const requestOptions = {
			method: 'POST',
			body: {
				to: emailRef.current.value,
				message: "Bienvenido de nuevo",
				subject: "LanguageApp"
			}
		};
		fetch('http://localhost:5001/languageapp-4985f/us-central1/mailer', requestOptions )
			.then(async response => {
				const data = await response.json();
				if(!response.ok) {
					return Promise.reject( (data && data.message) || response.status ) //error
				}
				// setPostId(data.id);
			})
			.catch( error => {
				// setErrorMessage(error.toString());
				console.log('Error: ', error);
			});
		// async function signupUser() {
		// 	const response = await postMailer();
		// 	response.status === 200 &&
		// 		console.log('response: ', response);
		// }
		// signupUser()
	}, []);

	async function handleSubmit(e) {
		e.preventDefault();

		// passwordRef.current.value !== passwordConfirmRef.current.value && setError("Las contraseñas no coinciden.");
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Las contraseñas no coinciden.");
		}

		try {
			setError('');
			setLoading(true);
			// setAssociatedEmail(teacherAssociateEmail);
			console.log('1 - associatedEmail: ', associatedEmail);
			setAssociatedEmail(associatedEmail);
			console.log('2 - associatedEmail: ', associatedEmail);
			
			console.log('accountProfile: ', accountProfile );
			const res = !!accountProfile
				? await signup(emailRef.current.value, passwordRef.current.value)
				: setError("Seleccione el tipo de cuenta.");
			console.log('res.user:', res.user);

			await db.collection('user').doc(res.user.email).set({
				email: res.user.email,
				uid: res.user.uid,
				accountProfile,
				associatedEmail
			});

			// await db.collection(res.user.uid).add({ //crea una nueva collection a modo de ejemplo, solo para copiar y usar de base
			// 	name: 'ejemplo',
			// 	date: Date.now()
			// });

			<Dashboard isTeacherProp={ selectedAccountType }/>
			history.push("/");
		} catch (error) {
			console.log('Signup (handleSubmit) - error: ', error);

			error.code === 'auth/weak-password' &&
                setError("Contraseña débil - Ingrese 6 o mas caracteres.");
			error.code === 'auth/invalid-email' &&
                setError('Email no válido');
            error.code === 'auth/email-already-in-use' &&
                setError('Email ya utilizado');
		}
		setLoading(false);
	}

	const handleAccount = (checked, id) => {
		setSelectedAccountType(checked);
		setAccountProfile(id);
	}

    return (
        <>
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4"> Inscribirse </h2>
					{ error && <Alert variant="danger"> { error } </Alert> }
					<Form onSubmit={ handleSubmit }>
						<Form.Label>
							Seleccioná tu cuenta:
						</Form.Label>
						{
							!selectedAccountType ?
								[
									<Form.Check
										type="radio"
										id="institute"
										className="mb-2"
										label="Instituto"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
									/>,
									<Form.Check
										type="radio"
										id="teacher"
										className="mb-2"
										label="Docente"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id) }
										required
									/>,
									<Form.Check
										type="radio"
										id="student"
										className="mb-2"
										label="Estudiante"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
									/>
								] : accountProfile === 'institute' && accountProfile !== 'teacher' && accountProfile !== 'student' ?
								[
									<Form.Check
										type="radio"
										id="institute"
										className="mb-2"
										label="Instituto"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
										checked
									/>,
									<Form.Check
										type="radio"
										id="teacher"
										className="mb-2"
										label="Docente"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id) }
										required
									/>,
									<Form.Check
										type="radio"
										id="student"
										className="mb-2"
										label="Estudiante"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
									/>
								] :  accountProfile !== 'institute' && accountProfile === 'teacher' && accountProfile !== 'student' ?
								[
									<Form.Check
										type="radio"
										id="institute"
										className="mb-2"
										label="Instituto"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
									/>,
									<Form.Check
										type="radio"
										id="teacher"
										className="mb-2"
										label="Docente"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id) }
										required
										checked
									/>,
									<Form.Check
										type="radio"
										id="student"
										className="mb-2"
										label="Estudiante"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
									/>
								] :  accountProfile !== 'institute' && accountProfile !== 'teacher' && accountProfile === 'student' &&
								[
									<Form.Check
										type="radio"
										id="institute"
										className="mb-2"
										label="Instituto"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
									/>,
									<Form.Check
										type="radio"
										id="teacher"
										className="mb-2"
										label="Docente"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id) }
										required
									/>,
									<Form.Check
										type="radio"
										id="student"
										className="mb-2"
										label="Estudiante"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
										checked
									/>
								]
						}
						<Form.Group id="name">
							<Form.Label> Nombre </Form.Label>
							<Form.Control
								type="text"
								required
							/>
						</Form.Group>

						<Form.Group id="lastName">
							<Form.Label> Apellido </Form.Label>
							<Form.Control
								type="text"
								required
							/>
						</Form.Group>

						<Form.Group id="phoneNumber">
							<Form.Label> Número de telefono </Form.Label>
							<Form.Control
								type="number"
								required
							/>
						</Form.Group>
						{	
							accountProfile === 'student' &&
								<Form.Group id="teacherAssociateEmail">
									<Form.Label> Correo electronico del profesor asociado </Form.Label>
									<Form.Control
										type="email"
										onChange={e => setAssociatedEmail(e.target.value)}
										name="title"
										required
										/>
								</Form.Group>
						}
						<Form.Group id="email">
							<Form.Label> Email </Form.Label>
							<Form.Control
								type="email"
								ref={ emailRef }
								required
							/>
						</Form.Group>

						<Form.Group id="password">
							<Form.Label> Contraseña </Form.Label>
							<Form.Control
								type="password"
								ref={ passwordRef }
								required
							/>
						</Form.Group>

						<Form.Group id="password-confirm">
							<Form.Label> Confirmar Contraseña </Form.Label>
							<Form.Control
								type="password"
								ref={ passwordConfirmRef }
								required
							/>
						</Form.Group>
						
						<Button disable={ loading } className="w-100 btn-info mt-3" type="submit" >
							Inscribirse
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<div className="w-100 text-center mt-4 mb-4">
				¿Ya tienes una cuenta?
				<Link to="/login"> Iniciar sesión </Link>
			</div>
        </>
    )
}

export default Signup;
