import React, { useState } from 'react';
import { MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { Fetch } from 'toolbox/Fetch';

function ShelterMarkers({ center, zoomLv, scale }) {
    const displayLv = zoomLv * parseInt(100 / 14)
    const halfBoundary = scale * 100000
    const shelterUri = `http://localhost:8080/shelter/지진-옥외/${center.latitude}/${center.longitude}/${displayLv}/${halfBoundary}`;

    const [target, setTarget] = useState(0)

    function RenderSuccess(shelterList) {
        return <>
            {shelterList?.map((shelter, index) => (
                <>
                    <MapMarker
                        position={shelter.shelterId}
                        onClick={() => setTarget(index)}
                        removable={true}
                        clickable={true}
                        image={{
                            src: "https://cdn-icons-png.flaticon.com/128/4467/4467108.png", // 마커이미지의 주소
                            size: {
                                width: 40,
                                height: 40,
                            } // 마커이미지의 크기입니다
                        }}
                    />
                </>
            ))}
            {shelterList?.filter((shelter, idx) => idx === target).map(shelter => (
                <CustomOverlayMap
                    position={shelter.shelterId}
                    xAnchor={0.3}
                    yAnchor={0.5}
                >
                    <div class="overlaybox">
                        <div class="info">
                            <div class="title" align="center">
                                {shelter.name}
                                <div class="close" onClick={() => setTarget(false)} title="닫기"></div>
                            </div>
                            <div class="body">
                                <div class="desc">
                                    <div class="ellipsis" align="center">
                                        {shelter.addr} <br/>
                                        <a
                                            href={`https://map.kakao.com/link/to/${shelter.name},${shelter.shelterId.lat},${shelter.shelterId.lng}`}
                                            style={{ color: "blue" }}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            길찾기
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CustomOverlayMap>
            ))}
        </>
    }

    return (
        <Fetch uri={shelterUri} renderSuccess={RenderSuccess} />
    );
}

export default ShelterMarkers;