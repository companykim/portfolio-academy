import React, { useState, useEffect } from 'react';
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk"
import CustomOverlay2Style from 'style/CustomOverlay2Style';
import ShelterMarkers from './ShelterMarkers';
import { Polyline } from 'react-kakao-maps-sdk';
import CalculatePolylineDistanceStyle from 'style/CalculatePolylineDistanceStyle';

export default function ShelterMap() {
    const { kakao } = window;
    const [curPos, setCurPos] = useState(null); // 현재 위치를 저장할 상태
    const [zoomLv, setZoomLv] = useState(3);   // 지도의 확대 레벨. 1: 코앞에(20m), 30m,50m,100m,250m,500m,1km,2km,4km,8km,16km,32km,64km 10: 멀리(도) 14: 최대(128km)
    const [isOpen, setIsOpen] = useState(false);

    // 현재 위치 가져오기, [] 생성 시에 자동실행
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(geolocSuccessHandler, geolocErrorHandler); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
    }, []);

    const geolocSuccessHandler = (response) => {
        console.log(response); // coords: GeolocationCoordinates {latitude: 위도, longitude: 경도, …} timestamp: 1673446873903
        const { latitude, longitude } = response.coords;
        setCurPos({ latitude, longitude });
    };

    const geolocErrorHandler = (error) => {
        console.log(error);
    };

    // 선의 거리 계산하기
    // 마우스 클릭: 시작, 오른쪽 마우스 클릭: 종료
    const [isdrawing, setIsdrawing] = useState(false) // 선 그릴거야
    const [clickDot, setClickDot] = useState() // 점 찍기
    const [path, setPath] = useState([]) // 경로 그리기
    const [distances, setDistances] = useState([]) // 거리 계산
    const [mousePosition, setMousePosition] = useState({ 
        lat: 0,
        lng: 0,
    }) // 마우스 상 위도 경도
    const [moveLine, setMoveLine] = useState() // 점 찍고 다음 점 까지의 커서 움직임

    const [startDist, setStartDist] = useState(false) // 거리재기 토글

    // 버튼을 누르면 거리재기가 실행됨
    const distToggle = (e) => {
        e.preventDefault();
        setStartDist(!startDist)
        setPath([])
    }

    const handleClick = (_map, mouseEvent) => {
        if (!startDist) {
            // 거리재기 버튼이 활성화된 상태가 아니라면 무시
            return
        } 
        if (!isdrawing) {
            // 그리는 중이 아니면 거리재기도 경로 그리기도 0
            setDistances([])
            setPath([])
        }
        setPath((prev) => [
            ...prev,
            {
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
            },
        ])
        setDistances((prev) => [
            ...prev,
            Math.round(clickDot.getLength() + moveLine.getLength()), // 점에서 그린 선까지의 거리 계산
        ])
        setIsdrawing(true)
    }

    const handleMouseMove = (_map, mouseEvent) => {
        if (!startDist) { 
            return
        }
        setMousePosition({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
        })
    }

    // 마우스 오른쪽 클릭 -> 종료
    const handleRightClick = (_map, mouseEvent) => {
        if (!startDist) {
            return
        }
        setIsdrawing(false)
    }

    const DistanceInfo = ({ distance }) => {
        const walkkTime = (distance / 67) | 0

        return (
            <ul className="dotOverlay distanceInfo">
                <li>
                    <span className="label">총거리</span>{" "}
                    <span className="number">{distance}</span>m
                </li>
                <li>
                    <span className="label">도보</span>{" "}
                    {walkkTime > 60 && (
                        <>
                            <span className="number">{Math.floor(walkkTime / 60)}</span> 시간{" "}
                        </>
                    )}
                    <span className="number">{walkkTime % 60}</span> 분
                </li>
            </ul>
        )
    }

    return (
        <>
            <CustomOverlay2Style />
            {curPos && <>
                <Map // 지도를 표시할 Container
                    center={{
                        // 지도의 중심좌표
                        lat: curPos.latitude,
                        lng: curPos.longitude
                    }}
                    style={{
                        // 지도의 크기
                        width: "100%",
                        height: "600px",
                    }}
                    level={zoomLv} // 지도의 확대 레벨

                    onClick={handleClick}
                    onRightClick={handleRightClick}
                    onMouseMove={handleMouseMove}
                >
                    {/* 내위치 표시 */}
                    <MapMarker
                        position={{
                            lat: curPos.latitude,
                            lng: curPos.longitude
                        }}
                        image={{
                            src: "https://cdn-icons-gif.flaticon.com/12589/12589164.gif", // 마커이미지의 주소
                            size: {
                                width: 50,
                                height: 50,
                            } // 마커이미지의 크기입니다
                        }}
                        clickable={true}
                        removable={true}
                        onMouseOver={() => setIsOpen(true)}
                        onMouseOut={() => setIsOpen(false)}
                    >
                        {isOpen && (<div style={{ minWidth: "150px" }}>
                            <div style={{ padding: "5px", color: "#000", textAlign: "center" }}>내 위치</div>
                        </div>)}
                    </MapMarker>

                    <ShelterMarkers center={curPos} zoomLv={zoomLv} scale={50} />

                    {/* // 선의 거리 계산하기 */}
                    {startDist && <> 
                    <CalculatePolylineDistanceStyle />
                    <Polyline
                        path={path}
                        strokeWeight={3} // 선의 두께입니다
                        strokeColor={"#db4040"} // 선의 색깔입니다
                        strokeOpacity={1} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                        strokeStyle={"solid"} // 선의 스타일입니다
                        onCreate={setClickDot}
                    />
                    {path.map((path) => (
                        <CustomOverlayMap
                            key={`dot-${path.lat},${path.lng}`}
                            position={path}
                            zIndex={1}
                        >
                            <span className="dot"></span>
                        </CustomOverlayMap>
                    ))}
                    {path.length > 1 &&
                        distances.slice(1, distances.length).map((distance, index) => (
                            <CustomOverlayMap
                                key={`distance-${path[index + 1].lat},${path[index + 1].lng}`}
                                position={path[index + 1]}
                                yAnchor={1}
                                zIndex={2}
                            >
                                {!isdrawing && distances.length === index + 2 ? (
                                    <DistanceInfo distance={distance} />
                                ) : (
                                    <div className="dotOverlay">
                                        거리 <span className="number">{distance}</span>m
                                    </div>
                                )}
                            </CustomOverlayMap>
                        ))}
                    <Polyline
                        path={isdrawing ? [path[path.length - 1], mousePosition] : []}
                        strokeWeight={3} // 선의 두께입니다
                        strokeColor={"#db4040"} // 선의 색깔입니다
                        strokeOpacity={0.5} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                        strokeStyle={"solid"} // 선의 스타일입니다
                        onCreate={setMoveLine}
                    />
                    {isdrawing && (
                        <CustomOverlayMap position={mousePosition} yAnchor={1} zIndex={2}>
                            <div className="dotOverlay distanceInfo">
                                총거리{" "}
                                <span className="number">
                                    {Math.round(clickDot.getLength() + moveLine.getLength())}
                                </span>
                                m
                            </div>
                        </CustomOverlayMap>
                    )}
                    </>}
                    <button onClick={distToggle}>거리재기</button>
                </Map>
            </>
            }
        </>
    )
}