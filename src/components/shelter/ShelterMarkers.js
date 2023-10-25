import React from 'react';
import { Fetch } from 'toolbox/Fetch';
import { Map, MapMarker, MapInfoWindow, CustomOverlayMap } from "react-kakao-maps-sdk"
import CustomOverlay2Style from 'style/CustomOverlay2Style';

function ShelterMarkers({ center, zoomLvl, scale }) {
    const displayLevel = zoomLvl * parseInt(100 / 14)
    const halfBoundary = scale * 10000
    const shelterUri = `http://localhost:8080/shelter/지진/${center.latitude}/${center.longitude}/${displayLevel}/${halfBoundary}`;

    const ListLocInfo = () => (
        <div className="overlaybox">
        <div className="boxtitle">내 위치</div>
        <div className="locAddr">
          <div className="locAddr_text">드래곤 길들이기2</div>
        </div>
      </div>
    )

    function renderSuccess(shelterList) {
        return <>
            {shelterList?.map(shelter => (
                <>
                <MapMarker // 현재 위치 표시
                    position={{
                        lat: shelter.shelterId.lat,
                        lng: shelter.shelterId.lng
                    }}
                    title={shelter.name}
                />
                </>
            ))}
        </>
    }

    return (
        <Fetch uri={shelterUri} renderSuccess={renderSuccess} />
    );
}

export default ShelterMarkers;