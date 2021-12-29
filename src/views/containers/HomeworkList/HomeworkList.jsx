import React,
	{
        useEffect,
		useState
	} from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { db } from '../../../config/firebaseApp';
import {
	Form
} from "react-bootstrap";

// import shortid from 'shortid';

// import HomeworkListStudent from './HomeworkListStudent';

const HomeworkList = (props) => {

    // console.log('email: ', email);
    const [ tareas, setTareas ] = useState([]);
    const [ tarea, setTarea ] = useState('');
    const [ taskDetail, setTaskDetail ] = useState('');
    
    const [ modoEdicion, setModoEdicion ] = useState(false);
    const [ id, setId ] = useState('');
    const [ ultimo, setUltimo ] = useState(null);
    const [ desactivar, setDesactivar ] = useState(false);

    const [ profile, setProfile ] = useState([]);
    const [allUsers, setAllUsers ] = useState([]);

    const [ uidTeacher, setUidTeacher ] = useState('');
    const [ uidStudent, setUidStudent ] = useState('');
    const [ isDone, setIsDone ] = useState(true);
    const [ allTask, setAllTask ] = useState([]);
    const [ listOfDone, setListOfDone ] = useState(false);
    const [ detail, setdetail ] = useState(false);

    // const [ error, setError ] = useState(null);


    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setDesactivar(true);
                setAllUsers(props.profile);

                // console.log('allUsers: ', allUsers);
                //Busco y guardo en un state todos los datos del perfil logeado
                props.profile.filter( elem => elem.email === props.user.email && setProfile(elem) );
                // Guardo el uid del alumno
                profile.accountProfile === 'student' && setUidStudent(profile.uid)
                // Busco el UID del profesor para traer la lista de tareas, ya sea siendo alumno o profesor
                profile.accountProfile === 'student' && allUsers.filter(item => profile.associatedEmail === item.email && setUidTeacher(item.uid))
                profile.accountProfile === 'teacher' && setUidTeacher(props.user.uid)
                
                // console.log('uidTeacher: ', uidTeacher);
                // console.log('uidStudent: ', uidStudent);
                
                const data = await db.collection( uidTeacher )
                    .limit(2)
                    .orderBy('date')
                    .get()
                        
                const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() })) //...doc.data() <- Opererador de propagacion
                setUltimo(data.docs[data.docs.length - 1]);
                setTareas(arrayData);

                const query = await db.collection(uidTeacher)
                    .limit(2)
                    .orderBy('date')
                    .startAfter(data.docs[data.docs.length - 1])
                    .get()
                query.empty
                    ? setDesactivar(true) // console.log('no hay más documentos')
                    : setDesactivar(false)

                const tasks = await db.collection('task').get();
                const arrayTasks = tasks.docs.map(doc => ({ id: doc.id, ...doc.data() })) //...doc.data() <- Opererador de propagacion
                setAllTask(arrayTasks);

                
            } catch(error) {
                console.log('HomeworkList (obtenerDatos) - error: ', error);
            }
        }
        obtenerDatos();
    }, [allUsers, profile, props.profile, props.user.email, props.user.uid, uidTeacher, uidStudent ]);

    const siguiente = async() => {
        setDesactivar(true)
        try {
            const data = await db.collection(uidTeacher)
                .limit(2)
                .orderBy('date')
                .startAfter(ultimo)
                .get()
            const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTareas([
                ...tareas,
                ...arrayData
            ]);
            setUltimo(data.docs[data.docs.length - 1]);

            const query = await db.collection(uidTeacher)
                .limit(2)
                .orderBy('date')
                .startAfter(data.docs[data.docs.length - 1])
                .get()
            query.empty
                ? setDesactivar(true) // console.log('no hay más documentos')
                : setDesactivar(false)
        } catch (error) {
            console.log('HomeworkList (siguiente) - error: ', error);
        }
    }

    const agregar = async (e) => {
        e.preventDefault();
        if(!tarea.trim() && !taskDetail.trim()){
            // console.log('Elemento Vacío');
            // setError('Escriba algo por favor...');
            return;
        }

        try {
            const nuevaTarea = {
                name: tarea,
                detail: taskDetail,
                date: Date.now(),
                creatorID: uidTeacher
            }
            const data = await db.collection(uidTeacher).add(nuevaTarea);

            setTareas([
                ...tareas,
                {...nuevaTarea, id: data.id}
            ])

            setTarea('');
            setTaskDetail('');
        } catch (error) {
            console.log('HomeworkList (agregar) - error: ', error);
        }
    }

    const eliminar = async (id)  => {
        try {
            await db.collection(uidTeacher).doc(id).delete();

            const arrayFiltrado = tareas.filter(item => item.id !== id);
            setTareas(arrayFiltrado);

        } catch (error) {
            console.log('HomeworkList (eliminar) - error: ', error);
        }
    }

    const activarEdicion = (item) => {
        setModoEdicion(true);
        setTarea(item.name);
        setTaskDetail(item.detail);
        setId(item.id);
    }


    const editar = async (e) => {
        e.preventDefault();
        if(!tarea.trim() && !taskDetail.trim()) {
            // console.log('vacio')
            return;
        }
        try {
            await db.collection(uidTeacher).doc(id).update({
                name: tarea,
                detail: taskDetail
            });
            const arrayEditado = tareas.map(item => (
                item.id === id ? {id: item.id, date: item.date, name: tarea, detail: taskDetail} : item
            ));
            setTareas(arrayEditado)
            setModoEdicion(false)
            setTarea('')
            setTaskDetail('')
            setId('')
        } catch (error) {
            console.log('HomeworkList (editar) - error: ', error);
        }
    }

    const handleTask = async (item) => {
        if(!item.name.trim()){
            return;
        }
        try {
            await setIsDone(!isDone);
            await db.collection('task').doc(item.id).set({
                name: item.name,
                date: item.date,
                creatorID: item.creatorID,
                taskStatus: [
                    // ...allTask.taskStatus,
                    {status: isDone, id: uidStudent}
                ]
            });
        } catch (error) {
            console.log('HomeworkList (handleTask) - error: ', error);
        }
        console.log('handleTask - item.id: ', item.id);
        console.log('handleTask - item: ', item);
        console.log('handleTask - isDone: ', isDone);
    }

    return (
        <div className="container mt-3">
            <div className="row">
                {
                // console.log('tareas: ', tareas, 'profile: ', profile)
                // console.log('profile: ', profile)
                }

                <div className={props.profile.filter( item => item.email === props.user.email && item.accountProfile === 'teacher' ? "col-md-6" : "col-md-12" )  }>
                    <h3>Lista de tareas</h3>
                    {/* {console.log('allTask: ', allTask)} */}
                    {
                        !!profile && profile.accountProfile === 'teacher' ?
                            <>
                                <button
                                    className="btn btn-warning btn-sm float-right ml-3"
                                    onClick={ () => setListOfDone(!listOfDone) }
                                >
                                    Ver lista de realizados/pendientes
                                </button>
                                <button
                                    className="btn btn-warning btn-sm float-right ml-3"
                                    onClick={ () => setdetail(!detail) }
                                >
                                    Ver detalle
                                </button>
                            </>
                        : 
                            <button
                                className="btn btn-warning btn-sm float-right ml-3"
                                onClick={ () => setdetail(!detail) }
                            >
                                Ver detalle
                            </button>
                    }
                    <ul className="list-group">
                        {
                            tareas.length === 0
                                ? ( <li className="list-group-item">No hay tareas</li> )
                                : (
                                    <li>
                                        {
                                            tareas.map(item => {
                                                return (
                                                    !!profile && profile.accountProfile === 'teacher'
                                                        ? ( <li className="list-group-item" key={item.id}>
                                                                <span className="lead" >
                                                                    { moment(item.date).format('l')} - { item.name }
                                                                    <button
                                                                        className="btn btn-danger btn-sm float-right ml-2"
                                                                        onClick={ () => eliminar(item.id) }
                                                                    >
                                                                        Eliminar
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-warning btn-sm float-right ml-3"
                                                                        onClick={ () => activarEdicion(item) }
                                                                    >
                                                                        Editar
                                                                    </button>

                                                                    {
                                                                        detail && !!item.detail &&<p> <br/> {item.detail}</p>
                                                                    }
                                                                    <br/>
                                                                    {
                                                                        listOfDone &&
                                                                        
                                                                            allTask.map(elem => {
                                                                                    return item.id === elem.id && elem.taskStatus.map(elem2 => {
                                                                                        return (allUsers.map(elem3 => {
                                                                                                if( elem3.accountProfile === 'student' && elem3.associatedEmail === props.user.email) {
                                                                                                    
                                                                                                    return elem2.id === elem3.uid && elem2.status
                                                                                                        ? `${ elem3.email } (Realizado) `
                                                                                                        : `${ elem3.email } (Pendiente) `
                                                                                                }
                                                                                        }))
                                                                                    })
                                                                            })
                                                                    }
                                                                </span>
                                                            </li>
                                                        ) : (
                                                            <div className="col-md-12">
                                                                {
                                                                    <li className="list-group-item" key={profile.id}>
                                                                        {
                                                                            <Form.Check
                                                                                className="mb-1"
                                                                                type="checkbox"
                                                                                id="task"
                                                                                label= { `${ moment(item.date).format('l')} - ${ item.name }` }
                                                                                onChange={ () => handleTask(item) }
                                                                                block
                                                                                //Si muestro las tareas que marco no cambian visualmente, se monta en sitio web y no vuelvo a consultar el estado de las tareas
                                                                                // checked={
                                                                                //     allTask.map(elem => {
                                                                                //         return item.id === elem.id && elem.taskStatus.map(elem2 => elem2.status)
                                                                                //     })
                                                                                // }
                                                                            />
                                                                        }
                                                                        
                                                                        {
                                                                            detail && !!item.detail &&<p> <br/> {item.detail}</p>
                                                                        }
                                                                        <br/>

                                                                    </li>
                                                                }
                                                            </div>
                                                        )
                                                )
                                            })
                                        }
                                    </li>
                                )
                        }
                    </ul>
                    <button
                        className="btn btn-info btn-block mt-2 center btn-sm col-md-4"
                        onClick={() => siguiente()}
                        disabled={desactivar}
                    >
                        Siguiente...
                    </button>
                </div>
                {
                   !!profile  && profile.accountProfile === 'teacher' &&
                        <div className="col-md-6">
                            <h3>
                                {
                                    modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
                                }
                            </h3>
                            <form onSubmit={modoEdicion ? editar : agregar}>
                                <input 
                                    type="text"
                                    placeholder="Ingrese tarea"
                                    className="form-control mb-2"
                                    onChange={e => setTarea(e.target.value)}
                                    value={tarea}
                                />
                                <input 
                                    type="text"
                                    placeholder="Ingrese detalles"
                                    className="form-control mb-2"
                                    onChange={e => setTaskDetail(e.target.value)}
                                    value={taskDetail}
                                />
                                <button 
                                    className={
                                        modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
                                    }
                                    type="submit"
                                >
                                    {
                                        modoEdicion ? 'Editar' : 'Agregar'
                                    }
                                </button>
                            </form>
                        </div>
                    
                }
            </div>
            <hr/>
        </div>
    );
}

export default HomeworkList;
