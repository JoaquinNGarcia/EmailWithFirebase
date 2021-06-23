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
	const isTeacherRef = useRef();
	
    const { signup } = useAuth();
    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);
	const [ isTeacher, setIsTeacher ] = useState(false);
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
			console.log('Signup - isTeacher: ', isTeacher);
			<Dashboard isTeacherProp={ isTeacher }/>
			history.push("/");
		} catch {
			setError("No se pudo crear una cuenta.");
		}
		setLoading(false);
	}

    return (
        <>
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4"> Inscribirse </h2>
					{ error && <Alert variant="danger"> { error } </Alert> }
					<Form onSubmit={ handleSubmit }>
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
							<Form.Control type="password" ref={ passwordRef } required />
						</Form.Group>

						<Form.Group id="password-confirm">
							<Form.Label> Confirmar Contraseña </Form.Label>
							<Form.Control
								type="password"
								ref={ passwordConfirmRef }
								required
							/>
						</Form.Group>

						<Form.Check
							type="switch"
							id="custom-switch"
							className="mb-2"
							label="Docente"
							inline
							onChange={ ({ target: { checked }}) => setIsTeacher(checked) }
						/>

						<Form.Check 
							type="checkbox"
							id="autoSizingCheck"
							className="mb-2"
							label="Recuerdame"
							inline
							custom
						/>

						<Button disable={ loading } className="w-100 btn-info" type="submit" >
							Inscribirse
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<div className="w-100 text-center mt-2">
				¿Ya tienes una cuenta?
				<Link to="/login"> Iniciar sesión </Link>
			</div>
        </>
    )
}

export default Signup;
