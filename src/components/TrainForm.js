import React from "react";

const TrainForm = ({updateTrain,
                       trainId,
                       handleTrainIdChange,
                       trainName,
                       handleTrainNameChange,
                       trainDestination,
                       handleTrainDestinationChange,
                       trainSpeed,
                       handleTrainSpeedChange,
                       trainLatitude,
                       handleTrainLatitudeChange,
                       trainLongitude,
                       handleTrainLongitudeChange
                   }) => {
    return (
        <form onSubmit={updateTrain}>
            <div>
                id:
                <input
                    value={trainId}
                    onChange={handleTrainIdChange}/>
            </div>
            <div>
                name:
                <input
                    value={trainName}
                    onChange={handleTrainNameChange}/>
            </div>
            <div>
                destination:
                <input
                    value={trainDestination}
                    onChange={handleTrainDestinationChange}/>
            </div>
            <div>
                speed:
                <input
                    value={trainSpeed}
                    onChange={handleTrainSpeedChange}/>
            </div>
            latitude:
            <input
                value={trainLatitude}
                onChange={handleTrainLatitudeChange}/>
            <div>
                longitude:
                <input
                    value={trainLongitude}
                    onChange={handleTrainLongitudeChange}/>
            </div>
            <div>
                <button type="submit">update</button>
            </div>
        </form>
    )
}

export default TrainForm