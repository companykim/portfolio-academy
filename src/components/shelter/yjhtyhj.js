import React, {useState} from 'react';
import { Fetch } from 'toolbox/Fetch';
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk"
import CustomOverlay2Style from 'style/CustomOverlay2Style';

function ShelterMarkers({ center, zoomLvl, scale }) {
    const displayLevel = zoomLvl * parseInt(100 / 14)
    const halfBoundary = scale * 10000
    const shelterUri = `http://localhost:8080/shelter/지진/${center.latitude}/${center.longitude}/${displayLevel}/${halfBoundary}`;
    const [target, setTarget] = useState(false)
    
    function RenderSuccess(shelterList) {
        return <>
            {shelterList?.map(shelter => (
                <>
                <MapMarker // 현재 위치 표시
                    position={shelter.shelterId}
                    onClick={() => setTarget(true)}
                    />
                {target && (
                    <CustomOverlayMap
                        position={{
                            lat: shelter.shelterId.lat,
                            lng: shelter.shelterId.lng
                        }}
                        xAnchor={0.3}
                        yAnchor={0.91}
                    >
                        <div className="overlaybox">
                            <div className="boxtitle">{shelter.name}</div>
                            <div className="locAddr">
                                <div className="locAddr_text">{shelter.addr}</div>
                            </div>
                        </div>
                </CustomOverlayMap> )}
                </>
            ))}
        </>
    }

    return (
        <Fetch uri={shelterUri} renderSuccess={RenderSuccess} />
    );
}

export default ShelterMarkers;