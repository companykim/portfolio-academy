import React, {memo, useState, useEffect, useRef} from 'react';
import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

// 길찾기
const Directions = ({ origin, destination } ) => {
    const [directions ,setDirections] = useState();
    const count = useRef(0);

    const options = {
        polylineOptions: {
            strokeColor: "red",
            strokeWeight: 6,
            strokeOpacity: 0.8
        }
    };

    useEffect(() => {
        count.current = 0;
        console.log(origin, destination);
    }, [origin.lat, origin.lng, destination.lat, destination.lng]);

    const directionsCallback = (result, status) => {
        console.log(result, status);
        if (status === 'OK' && count.current === 0) {
            count.current += 1;
            setDirections(result); 
        }
    };

    return (
        <>
            <DirectionsService
                options={{ origin, destination, travelMode: 'TRANSIT'}}
                callback={directionsCallback}
            />
            <DirectionsRenderer directions={directions} options={options} />
        </>
    );
};
export default memo(Directions);