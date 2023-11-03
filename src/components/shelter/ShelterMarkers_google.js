import React, { useState } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { Fetch } from 'toolbox/Fetch';

export default function ShelterMarkers_google({ center, zoomLv, scale }) {
    const displayLv = zoomLv * parseInt(100 / 14)
    const halfBoundary = scale * 100000
    const shelterUri = `http://localhost:8080/shelter/지진-옥외/${center.latitude}/${center.longitude}/${displayLv}/${halfBoundary}`;

    const [target, setTarget] = useState(0)

    function RenderSuccess(shelterList) {
        return (
        <>
            {shelterList?.map((shelter, index) => (
                <>
                    <MarkerF
                        position={shelter.shelterId}
                        onClick={() => setTarget(index)}
                        removable={true}
                        clickable={true}
                        icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
                    />
                </>
            ))}
        </>
        )
    }
    return (
        <Fetch uri={shelterUri} renderSuccess={RenderSuccess} />
    );
}