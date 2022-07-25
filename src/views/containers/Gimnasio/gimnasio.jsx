import React,
    {
        useEffect,
        useState
    } from 'react';
import { HotTable, HotColumn } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { registerLanguageDictionary, esMX } from "handsontable/i18n";
import "handsontable/dist/handsontable.full.css";
// ejecutar para obtener todas las funciones de handsontable
registerAllModules();
registerLanguageDictionary(esMX);

const Gimnasio = () => {
    const [dia1, setDia1] = useState([]);
    const [dia2, setDia2] = useState([]);
    const [dia3, setDia3] = useState([]);

    useEffect(() => {
        setDia1([
        {
            "day1": 'Press plano con barra',
            "lap 1": "10kg",
            "lap 2": "20kg",
            "lap 3": "20kg",
            "lap 4": "30kg",
        },
        {
            "day1": 'Curl con w',
            "lap 1": "10kg",
            "lap 2": "12,5kg",
            "lap 3": "12,5kg",
            "lap 4": "20kg",
        },
        {
            "day1": 'Posteriores + messi',
            "lap 1": "Soga roja",
            "lap 2": "Soga roja",
            "lap 3": "Soga roja",
            "lap 4": "Soga roja",
        },
        {
            "day1": 'Press inclinado con mancuernas',
            "lap 1": "12,5kg",
            "lap 2": "15kg",
            "lap 3": "20kg",
            "lap 4": "20kg",
        },
        {
            "day1": 'Martillo',
            "lap 1": "10kg",
            "lap 2": "12,5kg",
            "lap 3": "14kg",
            "lap 4": "14kg",
        },
        {
            "day1": 'Rotaciones cuadrupedia',
            "lap 1": "Abdomen en 4",
            "lap 2": "Abdomen en 4",
            "lap 3": "Abdomen en 4",
            "lap 4": "Abdomen en 4",
        },

        {
            "day1": 'Aperturas plano',
            "lap 1": "5kg",
            "lap 2": "7,5kg",
            "lap 3": "10kg",
            "lap 4": "10kg",
        },
        {
            "day1": 'Scott con w',
            "lap 1": "10kg",
            "lap 2": "15kg",
            "lap 3": "20kg",
            "lap 4": "20kg",
        },
        {
            "day1": 'Posteriores con banda (abierto)',
            "lap 1": "Soga roja",
            "lap 2": "Soga roja",
            "lap 3": "Soga roja",
            "lap 4": "Soga roja",
        },
        ])
        setDia2([
            {
                "day2": 'Tirones toma abierta',
                "lap 1": "25kg",
                "lap 2": "35kg",
                "lap 3": "40kg",
                "lap 4": "49kg",
            },
            {
                "day2": 'Extensiones con soga',
                "lap 1": "10kg",
                "lap 2": "12.5kg",
                "lap 3": "15kg",
                "lap 4": "20kg",
            },
            {
                "day2": 'Espinales Y-W',
                "lap 1": "Acostado boca abajo",
                "lap 2": "Acostado boca abajo",
                "lap 3": "Acostado boca abajo",
                "lap 4": "Acostado boca abajo",
            },
            {
                "day2": 'Hammer toma abierta',
                "lap 1": "10kg",
                "lap 2": "15kg",
                "lap 3": "20kg",
                "lap 4": "20kg",
            },
            {
                "day2": 'Trasnuca 2 bb',
                "lap 1": "10kg",
                "lap 2": "12.5kg",
                "lap 3": "15kg",
                "lap 4": "17kg",
            },
            {
                "day2": 'Bird dog isométrico (20" x lado)',
                "lap 1": "En 4 un brazo y pierna extendido",
                "lap 2": "En 4 un brazo y pierna extendido",
                "lap 3": "En 4 un brazo y pierna extendido",
                "lap 4": "En 4 un brazo y pierna extendido",
            },
            {
                "day2": 'Remo bajo',
                "lap 1": "30kg",
                "lap 2": "35kg",
                "lap 3": "40kg",
                "lap 4": "45kg",
            },
            {
                "day2": 'Francés con mancuernas',
                "lap 1": "7,5kg",
                "lap 2": "7,5kg",
                "lap 3": "7,5kg",
                "lap 4": "7,5kg",
            },
            {
                "day2": 'Trx toma abierta',
                "lap 1": "",
                "lap 2": "",
                "lap 3": "",
                "lap 4": "",
            },
        ])
        setDia3([
            {
                "day3": 'Estocadas hacia atrás',
                "lap 1": "kg",
                "lap 2": "kg",
                "lap 3": "kg",
                "lap 4": "kg",
            },
            {
                "day3": 'Vuelos laterales',
                "lap 1": "kg",
                "lap 2": "kg",
                "lap 3": "kg",
                "lap 4": "kg",
            },
            {
                "day3": 'Dorsiflexion',
                "lap 1": "",
                "lap 2": "",
                "lap 3": "",
                "lap 4": "",
            },
            {
                "day3": 'Sentadilla copa',
                "lap 1": "kg",
                "lap 2": "kg",
                "lap 3": "kg",
                "lap 4": "kg",
            },
            {
                "day3": 'Arnold',
                "lap 1": "kg",
                "lap 2": "kg",
                "lap 3": "kg",
                "lap 4": "kg",
            },
            {
                "day3": 'Rotación de cadera',
                "lap 1": "",
                "lap 2": "",
                "lap 3": "",
                "lap 4": "",
            },
            {
                "day3": 'Despegue o peso muerto',
                "lap 1": "kg",
                "lap 2": "kg",
                "lap 3": "kg",
                "lap 4": "kg",
            },
            {
                "day3": 'Remo erguido',
                "lap 1": "kg",
                "lap 2": "kg",
                "lap 3": "kg",
                "lap 4": "kg",
            },
            {
                "day3": 'Extensión de rodilla',
                "lap 1": "",
                "lap 2": "",
                "lap 3": "",
                "lap 4": "",
            },
        ])    
    }, [setDia1, setDia2, setDia3]);
    

    return (
        <div className="navbar navbar-dark bg-dark">
            {
                //codigo para el gimnasio
                
                <>
                    <HotTable
                        // ref={hotTableComponent}
                        language={esMX.languageCode}
                        data={dia1}
                        licenseKey="non-commercial-and-evaluation"
                        colHeaders={true}
                        rowHeaders={true}
                        columnSorting={true}
                        mergeCells={true}
                        contextMenu={["row_above", "row_below"]}
                        readOnly={false}
                    >
                        <HotColumn
                            data="day1"
                            title="Dia 1"
                        />
                        <HotColumn
                            data="lap 1"
                            title="Vuelta 1"
                        />
                        <HotColumn
                            data="lap 2"
                            title="Vuelta 2"
                        />
                        <HotColumn
                            data="lap 3"
                            title="Vuelta 3"
                        />
                        <HotColumn
                            data="lap 4"
                            title="Vuelta 4"
                        />
                    </HotTable>
                    <HotTable
                        // ref={hotTableComponent}
                        language={esMX.languageCode}
                        data={dia2}
                        licenseKey="non-commercial-and-evaluation"
                        colHeaders={true}
                        rowHeaders={true}
                        columnSorting={true}
                        mergeCells={true}
                        contextMenu={["row_above", "row_below"]}
                        readOnly={false}
                    >
                        <HotColumn
                            data="day2"
                            title="Dia 2"
                        />
                        <HotColumn
                            data="lap 1"
                            title="Vuelta 1"
                        />
                        <HotColumn
                            data="lap 2"
                            title="Vuelta 2"
                        />
                        <HotColumn
                            data="lap 3"
                            title="Vuelta 3"
                        />
                        <HotColumn
                            data="lap 4"
                            title="Vuelta 4"
                        />
                    </HotTable>
                    <HotTable
                        // ref={hotTableComponent}
                        language={esMX.languageCode}
                        data={dia3}
                        licenseKey="non-commercial-and-evaluation"
                        colHeaders={true}
                        rowHeaders={true}
                        columnSorting={true}
                        mergeCells={true}
                        contextMenu={["row_above", "row_below"]}
                        readOnly={false}
                    >
                        <HotColumn
                            data="day3"
                            title="Dia 3"
                        />
                        <HotColumn
                            data="lap 1"
                            title="Vuelta 1"
                        />
                        <HotColumn
                            data="lap 2"
                            title="Vuelta 2"
                        />
                        <HotColumn
                            data="lap 3"
                            title="Vuelta 3"
                        />
                        <HotColumn
                            data="lap 4"
                            title="Vuelta 4"
                        />
                    </HotTable>
                </>
            }
        </div>
    )
}

export default Gimnasio;
