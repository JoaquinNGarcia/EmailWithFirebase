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
    const { login } = useAuth()
    const [ error, setError ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        } catch {
            setError("Error al iniciar sesión.");
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                <h5 className="text-center mb-4"> ¡Inicia sesión en tu cuenta de LanguageApp! </h5>
                { error && <Alert variant="danger">{ error }</Alert> }
                <Form onSubmit={ handleSubmit }>                    
                    <Form.Group id="email">
                        <Form.Label> Email </Form.Label>
                        <Form.Control type="email" ref={ emailRef } required />
                    </Form.Group>
                    
                    <Form.Group id="password">
                        <Form.Label> Contraseña </Form.Label>
                        <Form.Control type="password" ref={ passwordRef } required />
                    </Form.Group>
                    
                    <Form.Check 
                        type="checkbox"
                        id="autoSizingCheck"
                        className="mb-2"
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




// import React, { useRef } from 'react';
// import firebaseApp from '../../../config/firebaseApp';
// import {
//     Avatar,
//     Button,
//     Box,
//     CssBaseline,
//     TextField,
//     FormControlLabel,
//     Checkbox,
//     Link,
//     Grid,
//     Paper,
//     Typography
// } from '@material-ui/core';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// import { makeStyles } from '@material-ui/core/styles';


// const useStyles = makeStyles((theme) => ({
//     root: {
//         height: '100vh',
//     },
//     image: {
//         backgroundRepeat: 'no-repeat',
//         backgroundColor:
//         theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//     },
//     paper: {
//         margin: theme.spacing(8, 4),
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//     },
//     avatar: {
//         margin: theme.spacing(1),
//         backgroundColor: theme.palette.secondary.main,
//     },
//     form: {
//         width: '100%',
//         marginTop: theme.spacing(1),
//     },
//     submit: {
//         margin: theme.spacing(3, 0, 2),
//     },
// }))

//     // const signUp = () => {
//     //     const email = document.querySelector('#email').value;
//     //     const password = document.querySelector('#password').value;
//     //     firebaseApp.auth().createUserWithEmailAndPassword(email, password)
//     //     .then((u) => {
//     //         console.log('registrado con exito');
//     //     })
//     //     .catch((err) => {
//     //         console.log('Error: ' + err.toString());
//     //     })
//     // }

//     // const login = () => {
//     //     console.log('hola')
//         // const email = document.querySelector('#email').value;
//         // const password = document.querySelector('#password').value;
//         // firebaseApp.auth().signInWithEmailAndPassword(email, password)
//         // .then((u) => {
//         //     console.log('inicio sesion correctamente');
//         // })
//         // .catch((err) => {
//         //     console.log('Error: ' + err.toString());
//         // })
//     // }

// const Login = () => {
//     const classes = useStyles();

//     const emailRef = useRef(null);

//     const signUp = () => {
//         // e.preventDefault();
//         console.log('emailRef.current.value: ', emailRef?.current );
//     }



// 	return (
// 		<Grid container component="main" className={ classes.root }>


//                 {/* <button style={{margin: '10px'}} onClick={this.login}>Login</button>
//                 <button style={{margin: '10px'}} onClick={this.signUp}>Sign Up</button> */}

//             <CssBaseline />
//             {/* <Grid iten xs={false} sm={4} md={7} className={classes.image} /> */}
//             <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//                 <div className={classes.paper}>
//                     <Avatar className={classes.avatar}>
//                         <LockOutlinedIcon />
//                     </Avatar>
//                     <Typography component="h1" variant="h5">
//                         Login
//                     </Typography>
//                     <form className={classes.form} noValidate>
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="email"
//                             ref={ emailRef }
//                             label="Ingresar Email.."
//                             name="email"
//                             autoComplete="email"
//                             autoFocus
//                         />
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             name="password"
//                             label="Ingresar Password.."
//                             type="password"
//                             id="password"
//                             autoComplete="current-password"
//                         />
//                         <FormControlLabel
//                             control={<Checkbox value="remember" color="primary" />}
//                             label="Recuérdame"
//                         />
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             color="primary"
//                             className={classes.submit}
//                             onClick={ signUp }
//                         >
//                             iniciar Sesion
//                         </Button>
//                         {/* <Grid container>
//                             <Grid item xs>
//                                 <Link href="#" variant="body2">
//                                     ¿Olvidó su contraseña?
//                                 </Link>
//                             </Grid>
//                             <Grid item>
//                                 <Link href="#" variant="body2">
//                                     {"¿No tiene cuenta? Registrate"}
//                                 </Link>
//                             </Grid>
//                         </Grid>
//                         <Box mt={5}>
//                             <Copyright />
//                         </Box> */}
//                     </form>
//                 </div>
//             </Grid>
//         </Grid>
// 	);
// }

// Login.propTypes = {

// };

// export default Login;