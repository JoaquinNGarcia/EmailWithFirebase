import React,
	{
		useState
	} from 'react';
import {
	Alert,
	Button,
	Card
} from "react-bootstrap";
import { useAuth } from "../../contexts/authContext";
import {
	Link,
	useHistory
} from "react-router-dom";

const Dashboard = () => {
    const [ error, setError ] = useState("");
    const { currentUser, logout } = useAuth()
    const history = useHistory();

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
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4"> Perfil </h2>
                    { error && <Alert variant="danger"> { error } </Alert> }
                    <strong> Email: </strong>
                    { currentUser.email }
                    <Link to="/updateProfile" className="btn btn-info w-100 mt-3">
                        Actualizar perfil
                    </Link>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={ handleLogout }>
                    Cerrar sesión
                </Button>
            </div>
        </>
    );
}

export default Dashboard;