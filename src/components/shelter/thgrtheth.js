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
    const [isdrawing, setIsdrawing] = useState(false)
    const [clickLine, setClickLine] = useState()
    const [paths, setPaths] = useState([])
    const [distances, setDistances] = useState([])
    const [mousePosition, setMousePosition] = useState({
        lat: 0,
        lng: 0,
    })
    const [moveLine, setMoveLine] = useState()


    // 거리재기 토글
    const [calcDist, setCalcDist] = useState(false)

    const distToggle = (e) => {
        e.preventDefault();
        setCalcDist(!calcDist)
    }


    const handleClick = (
        _map,
        mouseEvent
    ) => {
        if (!isdrawing) {
            setDistances([])
            setPaths([])
        }
        setPaths((prev) => [
            ...prev,
            {
                lat: mouseEvent.latLng.getLat(),
                lng: mouseEvent.latLng.getLng(),
            },
        ])
        setDistances((prev) => [
            ...prev,
            Math.round(clickLine.getLength() + moveLine.getLength()),
        ])
        setIsdrawing(true)
    }

    const handleMouseMove = (
        _map,
        mouseEvent
    ) => {
        setMousePosition({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
        })
    }

    // 마우스 오른쪽 클릭 -> 종료
    const handleRightClick = (
        _map,
        _mouseEvent
    ) => {
        setIsdrawing(false)
    }


    const DistanceInfo = ({ distance }) => {
        const walkkTime = (distance / 67) | 0
        const bycicleTime = (distance / 227) | 0

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
                <li>
                    <span className="label">자전거</span>{" "}
                    {bycicleTime > 60 && (
                        <>
                            <span className="number">{Math.floor(bycicleTime / 60)}</span>{" "}
                            시간{" "}
                        </>
                    )}
                    <span className="number">{bycicleTime % 60}</span> 분
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
                            <img
                                alt="close"
                                width="14"
                                height="13"
                                src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
                                style={{
                                    position: "absolute",
                                    right: "5px",
                                    top: "5px",
                                    cursor: "pointer",

                                }}
                                onClick={() => setIsOpen(!isOpen)}
                            />
                            <div style={{ padding: "5px", color: "#000", textAlign: "center" }}>내 위치</div>
                        </div>)}
                    </MapMarker>


                    <ShelterMarkers center={curPos} zoomLv={zoomLv} scale={50} >
                        <div></div>
                    </ShelterMarkers>

                    {/* // 선의 거리 계산하기 */}
                    {calcDist && <> 
                    <CalculatePolylineDistanceStyle />
                    <Polyline
                        path={paths}
                        strokeWeight={3} // 선의 두께입니다
                        strokeColor={"#db4040"} // 선의 색깔입니다
                        strokeOpacity={1} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
                        strokeStyle={"solid"} // 선의 스타일입니다
                        onCreate={setClickLine}
                    />
                    {paths.map((path) => (
                        <CustomOverlayMap
                            key={`dot-${path.lat},${path.lng}`}
                            position={path}
                            zIndex={1}
                        >
                            <span className="dot"></span>
                        </CustomOverlayMap>
                    ))}
                    {paths.length > 1 &&
                        distances.slice(1, distances.length).map((distance, index) => (
                            <CustomOverlayMap
                                key={`distance-${paths[index + 1].lat},${paths[index + 1].lng}`}
                                position={paths[index + 1]}
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
                        path={isdrawing ? [paths[paths.length - 1], mousePosition] : []}
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
                                    {Math.round(clickLine.getLength() + moveLine.getLength())}
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