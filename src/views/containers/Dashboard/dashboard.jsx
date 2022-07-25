import React, {
    useEffect,
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
import HomeworkList from '../HomeworkList/homeworkList';
import { auth, db } from '../../../config/firebaseApp';
import Gimnasio from '../Gimnasio/gimnasio';
// import shortid from 'shortid' //https://www.npmjs.com/package/shortid


const Dashboard = ( { isTeacherProp } ) => {
    const [ error, setError ] = useState('');
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState([]);
    // const [ isLoading, setIsLoading ] = useState(true);
    const { currentUser, logout } = useAuth();
    const history = useHistory();


    useEffect(() => {
        auth.currentUser
            ? setUser(auth.currentUser)
            : history.push('/login');

        const obtenerDatos = async () => {
            try {
                const dataProfile = await db.collection('user').get();
                const arrayDataProfile = dataProfile.docs.map(doc => ({ id: doc.id, ...doc.data() })) //...doc.data() <- Opererador de propagacion
                setProfile( arrayDataProfile );
            } catch (error) {
                console.log('Dashboard (obtenerDatos) - error: ', error);
            }
        }
        obtenerDatos();
    }, [history]);

    const time = moment().format('HH:mm');
    const greet = ( time >= '06:00') && ( time < '13:00')
        ? 'Buenos dias'
        : (time >= '13:00') && ( time < '20:00')
            ? 'Buenas tardes'
            : 'Buenas noches';

    async function handleLogout() {
        setError('');
        try {
            await logout();
            history.push('/login');
        } catch (error) {
            console.log('Dashboard (handleLogout) - error: ', error);
            setError("No se pudo cerrar la sesión.");
        }
    }

    return (
        <>
            {/* { console.log('props: ', props) } */}
            {/* { console.log('isTeacherProp: ', isTeacherProp) } */}

            <div className="w-100">
                <Card.Body>
                    {/* { console.log('currentUser: ', currentUser) } */}
                    <h2 className="text-center mb-4"> Perfil </h2>
                    { error && <Alert variant="danger"> { error } </Alert> }
                    <strong>
                        { `${ greet }` }
                    </strong>
                    {`, ${ currentUser.email }` }
                    <hr/>
                    <strong> Email: </strong>
                    { currentUser.email }
                    <Link to="/updateProfile" className="btn btn-info w-100 mt-3">
                        Actualizar perfil
                    </Link>
                </Card.Body>
                {
                    auth.currentUser.email === 'vitalite@mail.com'
                        ? <Gimnasio/>
                        : auth.currentUser.email !== 'vitalite@mail.com' && user && <HomeworkList user={ user } profile={ profile }/>
                }
            </div>

            <Form>
                {
                    profile.map( item => {
                        return (
                            item.email === auth.currentUser.email && 
                            item.accountProfile === 'teacher' &&
                            <div className="mt-5">
                                <Form.Label> Ingresar un archivo: </Form.Label>
                                <Form.File id="file">
                                    <Form.File.Input />
                                </Form.File>
                            </div>
                        )
                    })
                }
            </Form>
            <div className="w-100 text-center mt-2  ">
                <Button variant="link" onClick={ handleLogout }>
                    Cerrar sesión
                </Button>
            </div>
        </>
    );
}

export default Dashboard;