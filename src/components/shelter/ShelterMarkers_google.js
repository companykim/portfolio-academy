import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, InfoWindow, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Fetch } from 'toolbox/Fetch';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import {Dropdown, DropdownButton} from 'react-bootstrap';

// 파라미터: 함수에서 정의되어 사용되는 변수
export default function ShelterMarkers_google({ center, zoomLv, scale, clusterer, setDestPoint }) {
    const displayLv = zoomLv * parseInt(100 / 14)
    const halfBoundary = scale * 100000
    const [usageType, setUsageType] = useState(null);
    const shelterUri = `http://localhost:8080/shelter/${usageType}/${center.latitude}/${center.longitude}/${displayLv}/${halfBoundary}`;

    const [activeMarker, setActiveMarker] = useState(null);

    const [activeShelter, setActiveShelter] = useState(null);


    const handleActiveMarker = (marker) => {
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };
    
    // 내가 찍은 마커를 도착 지점으로 지정
    const handleActiveShelter = (chosenShelter) => {
        setDestPoint({ lat: chosenShelter.shelterId.lat, lng: chosenShelter.shelterId.lng });
    };
    
    // 마커 클러스터링
    new MarkerClusterer({
        algorithm: new SuperClusterAlgorithm({ radius: 100 })
    })
    
    function 대피소목록마커출력(shelterList) {
        return (
        <>
            {shelterList?.map((shelter) => (
                <>
                    <MarkerF 
                        onClick={() => handleActiveShelter(shelter)}
                        position={shelter.shelterId}
                        onRightClick={() => handleActiveMarker(shelter)}
                        image={{
                            src: "https://cdn-icons-png.flaticon.com/128/4467/4467108.png", // 마커이미지의 주소
                            size: {
                                width: 40,
                                height: 40,
                            } // 마커이미지의 크기입니다
                        }}
                        clusterer={clusterer}

                    />
                </>
            ))}

            {activeMarker !== null &&
                <InfoWindow onCloseClick={() => setActiveMarker(null)}
                    position={activeMarker.shelterId}
                >
                    <div align="Center">
                        {activeMarker.name} <br/>
                        {activeMarker.addr} < br/>
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${activeMarker.shelterId.lat},${activeMarker.shelterId.lng}`}
                            style={{ color: "blue" }}
                            target="_blank"
                            rel="noreferrer"
                        >
                            길찾기
                        </a>
                    </div>
                </InfoWindow>
            }
        </>
        )
    }

    return (
        <>
            <DropdownButton id="dropdown-basic-button" title="대피소 유형" onSelect={대피소유형정하기}>
                <Dropdown.Item eventKey="지진-옥외">지진-옥외</Dropdown.Item>
                <Dropdown.Item eventKey="지진-실내">지진-실내</Dropdown.Item>
                <Dropdown.Item eventKey="이재민임시">이재민임시</Dropdown.Item>

            </DropdownButton>

            {usageType &&
                <Fetch uri={shelterUri} renderSuccess={대피소목록마커출력} />
            }
        </>
    );

    function 대피소유형정하기(item) {
        setUsageType(item)
      }
}