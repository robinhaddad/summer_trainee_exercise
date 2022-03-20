import React, {useContext, useEffect, useState} from 'react'
import {UserContext} from '../App'
import TrainForm from "./TrainForm";
import LiveTrainData from "../services/LiveTrainData";
import trainDataService from "../services/TrainData";

const Protected = () => {

    const [trainId,setTrainId] = useState(1)
    const [trainName,setTrainName] = useState("Intercity 68")
    const [trainDestination, setTrainDestination] = useState("Tampere")
    const [trainSpeed,setTrainSpeed] = useState(99)
    const [trainLatitude,setTrainLatitude] = useState(44.5)
    const [trainLongitude,setTrainLongitude] = useState(33.3)
    const [trainData,setTrainData] = useState([])

    const [user] = useContext(UserContext)
    const [content, setContent] = useState('You need to login')

    const handleTrainIdChange = (event) => {
        console.log(event.target.value)
        setTrainId(event.target.value)
    }

    const handleTrainNameChange = (event) => {
        console.log(event.target.value)
        setTrainName(event.target.value)
    }

    const handleTrainDestinationChange = (event) => {
        console.log(event.target.value)
        setTrainDestination(event.target.value)
    }

    const handleTrainSpeedChange = (event) => {
        console.log(event.target.value)
        setTrainSpeed(event.target.value)
    }

    const handleTrainLatitudeChange = (event) => {
        console.log(event.target.value)
        setTrainLatitude(event.target.value)
    }

    const handleTrainLongitudeChange = (event) => {
        console.log(event.target.value)
        setTrainLongitude(event.target.value)
    }

    const updateTrain = (event) => {
        event.preventDefault()
        const trainObject = {
            id: trainId,
            name: trainName,
            destination: trainDestination,
            speed: trainSpeed,
            coordinates: [
                trainLatitude,
                trainLongitude
            ]
        }
        trainDataService
            .update(trainId, trainObject)
            .then(response => console.log(response))
        setTrainId(0)
        setTrainName("")
        setTrainDestination("")
        setTrainSpeed(0)
        setTrainLatitude(0)
        setTrainLongitude(0)
    }

    useEffect(() => {
        console.log('effect')
        setInterval(()=>{
            trainDataService
                .getAll()
                .then(initialTrains => {
                    setTrainData(initialTrains)
                })
        },3000)
    }, [])

    const trainDataMap = trainData.map(item => (
            <li key={item.id}>
                    id: {item.id}
                    &nbsp;name: {item.name}
                    &nbsp;destination: {item.destination}
                    &nbsp;speed: {item.speed}
                    &nbsp;latitude: {item.coordinates[0]}
                    &nbsp;longitude: {item.coordinates[1]}
            </li>
    ))
    console.log("trainDataMap",trainDataMap)

    useEffect(() => {
        async function fetchProtected() {
            const result = await (await fetch('http://localhost:4000/protected', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${user.accesstoken}`
                }
            })).json()
            if (result.data) {
                setContent(result.data)
            }
        }
        fetchProtected()
    },[user])

    if(content==='This is protected data'){
        return (
            <div>
                <div className="train-form">
                    <h2>Use train id to update the data:</h2>
                    <TrainForm
                        updateTrain={updateTrain}

                        trainId={trainId}
                        handleTrainIdChange={handleTrainIdChange}

                        trainName={trainName}
                        handleTrainNameChange={handleTrainNameChange}

                        trainDestination={trainDestination}
                        handleTrainDestinationChange={handleTrainDestinationChange}

                        trainSpeed={trainSpeed}
                        handleTrainSpeedChange={handleTrainSpeedChange}

                        trainLatitude={trainLatitude}
                        handleTrainLatitudeChange={handleTrainLatitudeChange}

                        trainLongitude={trainLongitude}
                        handleTrainLongitudeChange={handleTrainLongitudeChange}/>
                        <h2> Below is a list of the trains in the database:</h2>
                    <ul>
                        {trainDataMap}
                    </ul>

                </div>
                <div className="live-train-data">
                    <LiveTrainData/>
                </div>
            </div>)}
    return (<div>{content}</div>)
}

export default Protected