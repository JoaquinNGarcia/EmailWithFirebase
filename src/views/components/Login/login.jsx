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

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault()
        // // console.log('emailRef.current.value: ', emailRef.current.value);
        // // console.log('passwordpasswordRef.current.value: ', passwordRef.current.value);
        
        if( !emailRef.current.value.trim() || !passwordRef.current.value.trim() ) {
            console.log("Datos vacios email!");
            setError('Datos vacios email!');
            return
        }
        if( !passwordRef.current.value.trim() ){
            console.log('Datos vacios pass!');
            setError('Contraseña vacia!');
            return
        }
        if( passwordRef.current.value.length < 6 ) {
            console.log('Su contraseña debera contener 6 o mas carácteres!');
            setError('Su contraseña debera contener 6 o mas carácteres!');
            return
        }
        setError('');
        processData(error);
    }

    const processData = async(e) => {
        setLoading(false)
        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            history.push("/");
        } catch (error) {
            console.log('Login (handleSubmit) - error: ', error);
            error.code === 'auth/user-not-found' &&
                setError("Usuario no encontrado.");
            error.code === 'auth/wrong-password' &&
                setError("Contraseña incorrecta.");
            error.code === 'auth/too-many-requests' &&
                setError("Desactivamos temporalmente su cuenta debido a varios intentos fallidos de inicio de sesion, puede intentar de nuevo mas tarde o restablecer su contraseña.");
            error.code === 'auth/invalid-email' &&
                setError('Email no válido')
        }
        setLoading(false);
    }

    return (
        <>
            <Card>
                <Card.Body>
                <h5 className="text-center mb-4"> ¡Inicia sesión en tu cuenta de Email App! </h5>
                { error && <Alert variant="danger">{ error }</Alert> }
                <Form onSubmit={ handleSubmit }>                    
                    <Form.Group id="email">
                        <Form.Label> Email </Form.Label>
                        <Form.Control type="email" ref={ emailRef } required /> {/* el required lo habia sacado*/}
                    </Form.Group>
                    
                    <Form.Group id="password">
                        <Form.Label> Contraseña </Form.Label>
                        <Form.Control type="password" ref={ passwordRef } required /> {/* el required lo habia sacado*/}
                    </Form.Group>
                    
                    <Form.Check 
                        className="mb-2"
                        type="checkbox"
                        id="autoSizingCheck"
                        label="Recuerdame"
                        inline
                        custom
                    />

                    <Button disabled={ loading } className="w-100 btn-info" type="submit">
                        Iniciar sesión
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/forgotPassword"> ¿Olvidaste tu contraseña? </Link>
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

export default Login;
