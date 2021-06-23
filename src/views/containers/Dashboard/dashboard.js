import React,
	{
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
import moment from 'moment';

const Dashboard = ( { isTeacherProp } ) => {
    const [ error, setError ] = useState("");
    const { currentUser, logout } = useAuth();
    const history = useHistory();


    const time = moment().format('HH:mm');
    const greet = ( time >= '06:00') && ( time < '13:00')
        ? 'Buenos dias'
        : (time >= '13:00') && ( time < '20:00')
            ? 'Buenas tardes'
            : 'Buenas noches';


    async function handleLogout() {
        setError("");

        try {
            await logout();
            history.push("/login");
        } catch {
            setError("No se pudo cerrar la sesión.");
        }
    }


    return (
        <>
            {/* { console.log('props: ', props) } */}
            { console.log('isTeacherProp: ', isTeacherProp) }
            
            <Card>
                <Card.Body>
                    { console.log('currentUser: ', currentUser) }
                    <h2 className="text-center mb-4"> Perfil </h2>
                    { error && <Alert variant="danger"> { error } </Alert> }
                    <strong>
                        { `${ greet }` }
                    </strong>
                    {`, ${ currentUser.email }` }
                    <strong> Email: </strong>
                    { currentUser.email }
                    <Link to="/updateProfile" className="btn btn-info w-100 mt-3">
                        Actualizar perfil
                    </Link>
                </Card.Body>
            </Card>
            <Form>
                <div className="mb-1">
                    <Form.File id="file">
                        <Form.File.Input />
                    </Form.File>
                </div>
            </Form>

            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={ handleLogout }>
                    Cerrar sesión
                </Button>
            </div>
        </>
    );
}

export default Dashboard;