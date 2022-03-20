import React, {useEffect, useState} from 'react'
import axios from 'axios'

const LiveTrainData = () => {
    const [notes, setNotes] = useState([])
    const [trainNumberCheck,setTrainNumber] = useState(0)

    const handleTrainNumberChange = (event) => {
        console.log(event.target.value)
        setTrainNumber(event.target.value)
    }

    useEffect(() => {
            console.log('effect')
            setInterval(()=>{
                axios
                    .get('https://rata.digitraffic.fi/api/v1/train-locations/latest/')
                    .then(response => {
                            console.log('promise fulfilled')
                            console.log("response: ",response)
                            setNotes(response.data)

                    })
            },3000)
    }, [])
    console.log('render', notes.length, 'notes')

    function displayTrainFunc() {
        let result = notes
            .filter(train => train.trainNumber == trainNumberCheck)
            .map(train => (
                <div key={train.trainNumber}>
                    <p>train number: {train.trainNumber}</p>

                    <p>lat: {train.location.coordinates[0]}</p>
                    <p>lon: {train.location.coordinates[1]}</p>

                    <p>speed: {train.speed}</p>

                    <p>departure date: {train.departureDate}</p>
                    <p>timestamp: {train.timestamp}</p>
                </div>
            ))
        return result
    }

    function displayTrainNumbersFunc() {
        const trainNumbersArray = notes
            .map(train => train.trainNumber+", ")
        return trainNumbersArray
    }

    return (
        <div>
            <h2>Search live train data with train number</h2>
            Like for example train "IC 59" train number is 59 :
            <input
                value={trainNumberCheck}
                onChange={handleTrainNumberChange}/>
            {displayTrainFunc()}
            <h2>Below is a list of all the available train numbers</h2>
            {displayTrainNumbersFunc()}
        </div>
    )
}

export default LiveTrainData