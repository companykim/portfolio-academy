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
    const shelterUri = `http://localhost:8080/shelter/지진-옥외/${nowLat}/${nowLng}/1/40000`;

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

    return <>
        <table>
            <thead>
                <tr>
                    <th>장소명</th>
                    <th>주소</th>
                    <th>용도</th>
                    <th>displayLV</th>
                </tr>
            </thead>
            <tbody>
                <Fetch uri={shelterUri} renderSuccess={RenderSuccess} />
            </tbody>
        </table>
    </>
    function RenderSuccess(shelterList) {
        return shelterList.map(shelter => (
            <>
            <EventMarkerContainer
                key={`EventMarkerContainer-${shelter.shelterId.lat}-${shelter.shelterId.lng}`}
                position={shelter.shelterId}
                content={shelter.name}
            />
                <tr>
                    <td>{shelter.name}</td>
                    <td>{shelter.addr}</td>
                    <td>{shelter.usageType}</td>
                    <td>{shelter.displayLevel}</td>
                </tr>
            </>
        ))
    }
}