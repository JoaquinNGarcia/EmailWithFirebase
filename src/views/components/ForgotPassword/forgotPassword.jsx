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
	Link
} from "react-router-dom";

const ForgotPassword = () => {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [ error, setError ] = useState(null);
    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("Revisa tu correo para más instrucciones.");
        } catch (error) {
            console.log('ForgotPassword (handleSubmit) - error: ', error);
            setError("No se pudo restablecer la contraseña.");
        }
        setLoading(false);
    }

    return (
        <>
            <Card>
                <Card.Body>
                <h2 className="text-center mb-4"> Restabecer contraseña </h2>
                { error && <Alert variant="danger">{ error }</Alert> }
                { message && <Alert variant="success">{ message }</Alert> }
                <Form onSubmit={ handleSubmit }>
                    <Form.Group id="email">
                        <Form.Label> Email </Form.Label>
                        <Form.Control
                            type="email"
                            ref={ emailRef }
                            required
                        />
                    </Form.Group>
                    <Button disabled={ loading } className="w-100 btn-info" type="submit">
                       Restabecer
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/login"> Inicio </Link>
                </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                ¿No tienes una cuenta?
                <Link to="/signup"> Regístrate </Link>
            </div>
        </>
    );
}

export default ForgotPassword;