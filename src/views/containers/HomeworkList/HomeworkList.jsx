import React,
	{
        useEffect,
		useState
	} from 'react';
// import shortid from 'shortid';

// import HomeworkListStudent from './HomeworkListStudent';
import {firebase} from '../../../config/firebaseApp';

const HomeworkList = ({email}) => {

    // console.log('email: ', email);
    const [tareas, setTareas] = useState([]);
    const [tarea, setTarea] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [id, setId] = useState('');
    
    // const [error, setError] = useState(null);
    // const [tareasAlumno, setTareasAlumno] = useState(tarea);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {

                const db = firebase.firestore(); //inicializar el llamado a firestore
                const data = await db.collection('Homework').get();
                const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                // console.log(arrayData)
                setTareas(arrayData)

            } catch (error) {
                console.log(error)
            }
        }
        obtenerDatos();
    }, []);


    const agregar = async (e) => {
        e.preventDefault();
        if(!tarea.trim()){
            // console.log('Elemento Vacío');
            // setError('Escriba algo por favor...');
            return;
        }

        try {

            const db = firebase.firestore()
            const nuevaTarea = {
                name: tarea,
                fecha: Date.now()
            }
            const data = await db.collection('Homework').add(nuevaTarea);

            setTareas([
                ...tareas,
                {...nuevaTarea, id: data.id}
            ])

            setTarea('');
        } catch (error) {
            console.log(error);
        }

        // console.log(tarea);
    }

    const eliminar = async (id)  => {
        try {

            const db = firebase.firestore();
            await db.collection('Homework').doc(id).delete();

            const arrayFiltrado = tareas.filter(item => item.id !== id);
            setTareas(arrayFiltrado);

        } catch (error) {
            console.log(error)
        }
    }

    const activarEdicion = (item) => {
        setModoEdicion(true)
        setTarea(item.name)
        setId(item.id)
    }

    const editar = async (e) => {
        e.preventDefault()
        if(!tarea.trim()){
            // console.log('vacio')
            return
        }
        try {

            const db = firebase.firestore()
            await db.collection('Homework').doc(id).update({
                name: tarea
            })
            const arrayEditado = tareas.map(item => (
                item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
            ))
            setTareas(arrayEditado)
            setModoEdicion(false)
            setTarea('')
            setId('')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container mt-3">
            <div className="row">
                <div className={ email === "profesor@gmail.com" ? "col-md-6" : "col-md-12" }>
                    <h3>Lista de tareas</h3>
                    <ul className="list-group">
                        {
                            tareas.length === 0
                                ? ( <li className="list-group-item">No hay tareas</li> )
                                : ( 
                                    email === "profesor@gmail.com"
                                        ? (
                                            tareas.map(item =>
                                                <li className="list-group-item" key={item.id}>
                                                    <span className="lead">{item.name}</span>

                                                    <button 
                                                        className="btn btn-danger btn-sm float-right"
                                                        onClick={() => eliminar(item.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                    <button 
                                                        className="btn btn-warning btn-sm float-right mr-2"
                                                        onClick={() => activarEdicion(item)}
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
                                                            <span className="lead">{item.name}</span>
                                                        </li>
                                                    ))
                                                }
                                            </div>
                                        )
                                )
                        }
                    </ul>
                </div>
                {
                    email === "profesor@gmail.com" &&
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
                }
            </div>
            <hr/>
        </div>
    );
}

export default HomeworkList;
