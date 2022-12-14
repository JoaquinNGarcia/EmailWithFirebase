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

const UpdateProfile = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updatePassword, updateEmail } = useAuth()
    const [ error, setError ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const history = useHistory()

    const handleSubmit = e => {
        e.preventDefault();

		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Las contraseñas no coinciden.")
		}

        const promises = [];
        setLoading(true);
        setError("");

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value));
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                history.push("/");
            })
            .catch(() => {
                setError("No se pudo actualizar la cuenta.");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4"> Actualizar perfil </h2>
                    { error && <Alert variant="danger">{ error }</Alert> }
                    <Form onSubmit={ handleSubmit }>
                        <Form.Group id="email">
                            <Form.Label> Email </Form.Label>
                            <Form.Control
                                type="email"
                                ref={ emailRef }
                                required
                                defaultValue={ currentUser.email }
                            />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label> Contraseña </Form.Label>
                            <Form.Control
                                type="password"
                                ref={ passwordRef }
                                placeholder="Dejar en blanco para mantener la misma."
                            />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label> Confirmar Contraseña </Form.Label>
                            <Form.Control
                                type="password"
                                ref={ passwordConfirmRef }
                                placeholder="Dejar en blanco para mantener la misma."
                            />
                        </Form.Group>
                        <Button disabled={ loading } className="w-100 btn-info" type="submit">
                            Actualizar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2 mb-2">
                <Link to="/">Cancelar</Link>
            </div>
        </>
    );
}

export default UpdateProfile;