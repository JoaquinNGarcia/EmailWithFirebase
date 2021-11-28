import React from 'react';
import { auth } from '../../../config/firebaseApp';
import { withRouter } from 'react-router-dom';
import {
    Link,
    NavLink
} from 'react-router-dom';

const Navbar = ( props ) => {

    const cerrarSesion = () => {
        auth.signOut()
            .then(() => {
                props.history.push('/login');
            })
    }
    
    return (
        <div className="navbar navbar-dark bg-dark">
            <Link to="/" className="navbar-brand"> Language App </Link>
            <div>
                <div className="d-flex">
                    <NavLink
                        className="btn btn-dark mr-2"
                        to="/"
                        exact
                    >
                        Inicio
                    </NavLink>
                    {
                        props.firebaseUser !== null
                            ? ( <NavLink
                                    className="btn btn-dark mr-2"
                                    to="/admin"
                                >
                                    Admin
                                </NavLink>
                            )
                            : null
                    }
                    {
                        props.firebaseUser !== null
                            ? ( <button
                                    className="btn btn-dark"
                                    onClick={() => cerrarSesion()}
                                >
                                    Cerrar Sesión
                                </button>
                            )
                        : (
                            <NavLink
                                className="btn btn-dark"
                                to="/login"
                            >
                                Login
                            </NavLink>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default withRouter(Navbar);




// import React from 'react';
// import { useAuth } from '../../contexts/authContext';
// import { useHistory } from 'react-router-dom';
// import {
//     Link,
//     NavLink
// } from 'react-router-dom';

// const Navbar = ( props ) => {

//     const { logout } = useAuth();
//     const history = useHistory();
    
//     const cerrarSesion = async() => {
//         try {
//             await logout();
//             history.push('login');
//         } catch (error) {
//             console.log('NavBar (cerrarSesion) - error: ', error);
//         }
//     }
    
//     return (
//         <div className="navbar navbar-dark bg-dark">
//             <Link to="/" className="navbar-brand"> Language App </Link>
//             <div>
//                 <div className="d-flex">
//                     <NavLink
//                         className="btn btn-dark mr-2"
//                         to="/"
//                         exact
//                     >
//                         Inicio
//                     </NavLink>
//                     {
//                         props.firebaseUser !== null
//                             ? ( <NavLink
//                                     className="btn btn-dark mr-2"
//                                     to="/admin"
//                                 >
//                                     Admin
//                                 </NavLink>
//                             )
//                             : null
//                     }
//                     {
//                         props.firebaseUser !== null
//                             ? ( <button
//                                     className="btn btn-dark"
//                                     onClick={() => cerrarSesion()}
//                                 >
//                                     Cerrar Sesión
//                                 </button>
//                             )
//                         : (
//                             <NavLink
//                                 className="btn btn-dark"
//                                 to="/login"
//                             >
//                                 Login
//                             </NavLink>
//                         )
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Navbar;
