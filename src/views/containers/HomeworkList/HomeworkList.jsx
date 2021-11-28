import React,
	{
        useEffect,
		useState
	} from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { db } from '../../../config/firebaseApp';

// import shortid from 'shortid';

// import HomeworkListStudent from './HomeworkListStudent';

const HomeworkList = (props) => {

    // console.log('email: ', email);
    const [ tareas, setTareas ] = useState([]);
    const [ tarea, setTarea ] = useState('');
    const [ modoEdicion, setModoEdicion ] = useState(false);
    const [ id, setId ] = useState('');
    const [ ultimo, setUltimo ] = useState(null);
    const [ desactivar, setDesactivar ] = useState(false);
    // const [ uid, setUid ] = useState('');
    // const [ profile, setProfile ] = useState([]);

    // const [ error, setError ] = useState(null);
    // const [ tareasAlumno, setTareasAlumno ] = useState(tarea);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setDesactivar(true);
                
                const data = await db.collection(props.user.uid)
                    .limit(2)
                    .orderBy('fecha')
                    .get()
                const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() })) //...doc.data() <- Opererador de propagacion
                
                setUltimo(data.docs[data.docs.length - 1]);

                // console.log(arrayData)
                setTareas(arrayData);

                const query = await db.collection(props.user.uid)
                    .limit(2)
                    .orderBy('fecha')
                    .startAfter(data.docs[data.docs.length - 1])
                    .get()
                query.empty
                    ? setDesactivar(true) // console.log('no hay más documentos')
                    : setDesactivar(false)

            } catch (error) {
                console.log('HomeworkList (obtenerDatos) - error: ', error);
            }
        }
        obtenerDatos();
    }, [props.user.uid, props.user.associatedEmail, props.profile]);

    const siguiente = async() => {
        // console.log('siguiente')
        setDesactivar(true)
        try {
            const data = await db.collection(props.user.uid)
                .limit(2)
                .orderBy('fecha')
                .startAfter(ultimo)
                .get()
            const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTareas([
                ...tareas,
                ...arrayData
            ]);
            setUltimo(data.docs[data.docs.length - 1]);

            const query = await db.collection(props.user.uid)
                .limit(2)
                .orderBy('fecha')
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
        if(!tarea.trim()){
            // console.log('Elemento Vacío');
            // setError('Escriba algo por favor...');
            return;
        }

        try {

            const nuevaTarea = {
                name: tarea,
                fecha: Date.now()
            }
            const data = await db.collection(props.user.uid).add(nuevaTarea);

            setTareas([
                ...tareas,
                {...nuevaTarea, id: data.id}
            ])

            setTarea('');
        } catch (error) {
            console.log('HomeworkList (agregar) - error: ', error);
        }

        // console.log(tarea);
    }

    const eliminar = async (id)  => {
        try {

            await db.collection(props.user.uid).doc(id).delete();

            const arrayFiltrado = tareas.filter(item => item.id !== id);
            setTareas(arrayFiltrado);

        } catch (error) {
            console.log('HomeworkList (eliminar) - error: ', error);
        }
    }

    const activarEdicion = (item) => {
        setModoEdicion(true);
        setTarea(item.name);
        setId(item.id);
    }

    const editar = async (e) => {
        e.preventDefault();
        if(!tarea.trim()) {
            // console.log('vacio')
            return;
        }
        try {
            await db.collection(props.user.uid).doc(id).update({
                name: tarea
            });
            const arrayEditado = tareas.map(item => (
                item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
            ));
            setTareas(arrayEditado)
            setModoEdicion(false)
            setTarea('')
            setId('')
        } catch (error) {
            console.log('HomeworkList (editar) - error: ', error);
        }
    }

    return (
        <div className="container mt-3">
            <div className="row">
                {
                // setUid( props.profile.filter( item => item.email === props.user.email && !!props.user.uid ? props.uid : null ))
                // console.log('props.profile: ', props.profile)
                }
                <div className={props.profile.filter( item => item.email === props.user.email && item.accountProfile === 'teacher' ? "col-md-6" : "col-md-12" )  }>
                    <h3>Lista de tareas</h3>
                    {/* {console.log('uid: ', uid)} */}
                    <ul className="list-group">
                        {
                            tareas.length === 0
                                ? ( <li className="list-group-item">No hay tareas</li> )
                                : (
                                    props.profile.filter( item =>
                                        item.email === props.user.email && item.accountProfile === 'teacher'
                                            ? tareas.map(item => (
                                                    <li className="list-group-item" key={item.id}>
                                                        <span className="lead">{moment(item.fecha).format('l')} - {item.name}</span>

                                                        <button 
                                                            className="btn btn-danger btn-sm float-right"
                                                            onClick={ () => eliminar(item.id) }
                                                        >
                                                            Eliminar
                                                        </button>
                                                        <button 
                                                            className="btn btn-warning btn-sm float-right mr-2"
                                                            onClick={() => activarEdicion(item) }
                                                        >
                                                            Editar
                                                        </button>
                                                    </li>
                                                )
                                            ) : (
                                                <div className="col-md-12">
                                                    {
                                                        tareas.map(item => (
                                                            <li className="list-group-item" key={item.id}>
                                                                <span className="lead">{moment(item.fecha).format('l')} - {item.name}</span>
                                                            </li>
                                                        ))
                                                    }
                                                </div>
                                            )
                                    )
                                )
                        }
                    </ul>
                    <button 
                        className="btn btn-info btn-block mt-2 center btn-sm col-md-2"
                        onClick={() => siguiente()}
                        disabled={desactivar}
                    >
                        Siguiente...
                    </button>
                </div>
                {
                    props.profile.filter( item => item.email === props.user.email && item.accountProfile === 'teacher' &&
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
                    )
                }
            </div>
            <hr/>
        </div>
    );
}

export default HomeworkList;
