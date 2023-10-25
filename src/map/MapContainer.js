import React, { useState, useEffect} from 'react';
import { useMap } from '@uidotdev/usehooks';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import Button from 'react-bootstrap/Button';
import ShelterList from 'components/shelter/ShelterList';
import GlobalStyle from 'style/GlobalStyle';

const MapContainer = ({}) => {
    const { kakao } = window;
    const [address, setAddress] = useState(null); // 현재 좌표의 주소를 저장할 상태
    const [geoLocation, setGeoLocation] = useState(null); // 현재 위치를 저장할 상태
    const [isOpen, setIsOpen] = useState(false);

    // 현재 위치 가져오기
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(successHandler, errorHandler); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
    }, []);

    const successHandler = (response) => {
        console.log(response); // coords: GeolocationCoordinates {latitude: 위도, longitude: 경도, …} timestamp: 1673446873903
        const { latitude, longitude } = response.coords;
        setGeoLocation({ latitude, longitude });
    };

    const errorHandler = (error) => {
        console.log(error);
    };

    const getAddress = (lat, lng) => {
        const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
        const coord = new kakao.maps.LatLng(geoLocation.latitude, geoLocation.longitude); // 주소로 변환할 좌표 입력
        const callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setAddress(result[0].address);
            }
        };
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    };

    return (
        <>
            {geoLocation && <>
                <Map // 지도를 표시할 container
                    center={{ lat: geoLocation.latitude, lng: geoLocation.longitude }} // 지도의 중심 좌표
                    style={{ width: '1000px', height: '600px' }} // 지도의 크기
                    level={3} // 지도의 확대 레벨
                >   
                <ShelterList lat={geoLocation.latitude} lng={geoLocation.longitude}/>
                <MapMarker
                    position={{
                        lat: geoLocation.latitude,
                        lng: geoLocation.longitude
                    }}
                    image={{
                        src: "https://cdn.icon-icons.com/icons2/317/PNG/512/map-marker-icon_34392.png",
                        size: {
                            width: 64,
                            height: 69,
                        },
                        options: {
                            offset: {
                                x: 27,
                                y: 69,
                            },
                        },
                    }}
                    clickable={true}
                    onMouseOver={() => setIsOpen(true)}
                    onMouseOut={() => setIsOpen(false)}
                >

                    {isOpen && 
                        <>
                        <GlobalStyle />
                        <div style={{ padding: "10px", color: "#000"}}>내 위치</div>
                        </>
                    }
                </MapMarker>
                </Map>
            </>
            }
        </>
    );
};
export default MapContainer;