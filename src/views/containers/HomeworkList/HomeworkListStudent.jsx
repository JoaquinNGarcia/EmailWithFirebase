import React from 'react'

const HomeworkListStudent = ({tareas}) => {
    return (
        <div>
            <div className="row">
                        <div className="col-12">
                            <h4 className="text-center">Lista de tareas</h4>
                            <ul className="list-group">
                                {
                                    tareas.length === 0
                                        ? ( <li className="list-group-item">No hay tareas</li> )
                                        : ( tareas.map(item => (
                                            <li className="list-group-item" key={item.id}>
                                                <span className="lead">{item.nombreTarea}</span>
                                            </li>
                                        ))
                                        )

                                }
                            </ul>
                        </div>
                    </div>
        </div>
    )
}

export default HomeworkListStudent
