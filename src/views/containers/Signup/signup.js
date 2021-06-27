import React,
	{
		useRef,
		useState
	} from 'react';
import {
	Alert,
	Button,
	Card,
	Form
} from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import {
	Link,
	useHistory
} from "react-router-dom";
import Dashboard from '../Dashboard/dashboard';

// import welcomeMail from "../../../../functions/src/index";

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
	// const isTeacherRef = useRef();
	
    const { signup } = useAuth();
    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);
	const [ accountType, setAccountType ] = useState(false);
	const [ accountId, setAccountId ] = useState('')
    const history = useHistory();

	async function handleSubmit(e) {
		e.preventDefault();

		// passwordRef.current.value !== passwordConfirmRef.current.value && setError("Las contraseñas no coinciden.");
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Las contraseñas no coinciden.")
		}

		try {
			setError("");
			setLoading(true);
			await signup(emailRef.current.value, passwordRef.current.value);
			// await firebase.welcomeMail(emailRef.current.value, passwordRef.current.value)
			<Dashboard isTeacherProp={ accountType }/>
			history.push("/");
		} catch {
			setError("No se pudo crear una cuenta.");
		}
		setLoading(false);
	}

	const handleAccount = (checked, id) => {
		setAccountType(checked)
		setAccountId(id);
	}

    return (
        <>
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4"> Inscribirse </h2>
					{ error && <Alert variant="danger"> { error } </Alert> }
					<Form onSubmit={ handleSubmit }>
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
						<Form.Label>
							Seleccioná tu cuenta:
						</Form.Label>
						{
							!accountType ?
								[
									<Form.Check
										type="switch"
										id="institute"
										className="mb-2"
										label="Instituto"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
									/>,
									<Form.Check
										type="switch"
										id="teacher"
										className="mb-2"
										label="Docente"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id) }
										required
									/>,
									<Form.Check
										type="switch"
										id="student"
										className="mb-2"
										label="Estudiante"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										required
									/>
								] : accountId === 'institute' && accountId !== 'teacher' && accountId !== 'student' ?
								[
									<Form.Check
										type="switch"
										id="institute"
										className="mb-2"
										label="Instituto"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										checked
									/>,
									<Form.Check
										type="switch"
										id="teacher"
										className="mb-2"
										label="Docente"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id) }
									/>,
									<Form.Check
										type="switch"
										id="student"
										className="mb-2"
										label="Estudiante"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
									/>
								] :  accountId !== 'institute' && accountId === 'teacher' && accountId !== 'student' ?
								[
									<Form.Check
										type="switch"
										id="institute"
										className="mb-2"
										label="Instituto"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
									/>,
									<Form.Check
										type="switch"
										id="teacher"
										className="mb-2"
										label="Docente"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id) }
										checked
									/>,
									<Form.Check
										type="switch"
										id="student"
										className="mb-2"
										label="Estudiante"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
									/>
								] :  accountId !== 'institute' && accountId !== 'teacher' && accountId === 'student' &&
								[
									<Form.Check
										type="switch"
										id="institute"
										className="mb-2"
										label="Instituto"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
									/>,
									<Form.Check
										type="switch"
										id="teacher"
										className="mb-2"
										label="Docente"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id) }
									/>,
									<Form.Check
										type="switch"
										id="student"
										className="mb-2"
										label="Estudiante"
										block
										onChange={ ( { target: { checked, id } } ) => handleAccount(checked, id)  }
										checked
									/>
								]
						}
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
