import React, { useState, useEffect } from 'react';
import { useMap } from '@uidotdev/usehooks';
import { MapMarker } from 'react-kakao-maps-sdk';
import { useLocation } from 'react-router';
import { Fetch } from 'toolbox/Fetch';

export default function ShelterList({lat=0, lng=0}) {
    const [data, setData] = useState([]);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const [nowLat, setLat] = useState(lat)
    const [nowLng, setLng] = useState(lng)

    let state = location.state;
    console.log(state);
    const shelterUri = `http://localhost:8080/shelter/지진-옥외/${nowLat}/${nowLng}/1/400000`;

    useEffect(() => {
        fetch(shelterUri)
        .then(res => res.json())
        .then((data) => setData(data))
        .then(setLoading(false))
        .catch(setError);
    }, [shelterUri]);

    const EventMarkerContainer = ({ position, content }) => {
        const map = useMap()
        const [isVisible, setIsVisible] = useState(false)

        return (
            <MapMarker
                position={position}
                onClick={(marker) => map.panTo(marker.getPosition())}
                onMouseOver={() => setIsVisible(true)}
                onMouseOut={() => setIsVisible(false)}
            >
                {isVisible && content}
            </MapMarker>
        )
    }

    return <Fetch uri={shelterUri} renderSuccess={RenderSuccess} />

    function RenderSuccess(shelterList) {
        return shelterList.map(shelter => (
            <EventMarkerContainer
                key={`EventMarkerContainer-${shelter.shelterId.lat}-${shelter.shelterId.lng}`}
                position={shelter.shelterId}
                content={shelter.name}
            />
        ))
    }
}