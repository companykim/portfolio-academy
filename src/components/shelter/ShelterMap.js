import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MapInfoWindow, CustomOverlayMap } from "react-kakao-maps-sdk"
import CustomOverlay2Style from 'style/CustomOverlay2Style';
import ShelterMarkers from './ShelterMarkers';

export default function ShelterMap() {
  const { kakao } = window;
  const [curPos, setCurPos] = useState(null); // 현재 위치를 저장할 상태
  const [address, setAddress] = useState(null);
  const [zoomLvl, setZoomLvl] = useState(3);  //1:코앞에 20M, 2:30M, 50M, 100M, 250M, 500M, 1KM, 2KM, 4KM, 8KM, 16KM, 32KM, 13:64KM, 14 128KM 동북아

  console.log("ShelterMap")

  // 현재 위치를 ShelterMap을 생성할 때 준비해 줍니다.
  useEffect(() => {
    console.log("ShelterMap :: useEffect ")
    navigator.geolocation.getCurrentPosition(geolocSuccessHandler, geoLocError); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
  }, []);

  const geolocSuccessHandler = (response) => {
    console.log("geolocSuccessHandler = ", response)
    const { latitude, longitude } = response.coords;
    setCurPos({ latitude, longitude });
  };

  const geoLocError = (err) => {
    console.log("geoLocError = ", err)
  }

  const getAddress = (lat, lng) => {
    const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
    const coord = new kakao.maps.LatLng(curPos.latitude, curPos.longitude); // 주소로 변환할 좌표 입력
    const callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            setAddress(result[0].address);
        }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
};

  return (
    <>
      <CustomOverlay2Style />
      {curPos &&
        <Map // 지도를 표시할 Container
          center={{
            // 지도의 중심좌표
            lat: curPos.latitude,
            lng: curPos.longitude
          }}
          style={{
            // 지도의 크기
            width: "100%",
            height: "450px",
          }}
          level={zoomLvl}
        >
          <MapMarker // 현재 위치 표시
            position={{
              lat: curPos.latitude,
              lng: curPos.longitude
            }}
          />
        <ShelterMarkers center={curPos} zoomLvl={zoomLvl} scale={50}/>

          <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
            // 커스텀 오버레이가 표시될 위치입니다
            position={{
              lat: curPos.latitude,
              lng: curPos.longitude
            }}
            // 커스텀 오버레이가에 대한 확장 옵션
            xAnchor={0.3}
            yAnchor={0.91}
          >
            <div className="overlaybox">
              <div className="boxtitle">내 위치</div>
              <div className="locAddr">
                <div className="locAddr_text">gth</div>
              </div>
            </div>
          </CustomOverlayMap>
        </Map>
      }
    </>
  )
}
