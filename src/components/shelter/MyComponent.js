import React, { memo, useState, useEffect } from 'react'
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';
import ShelterMarkers_google from './ShelterMarkers_google';
import Directions from './Directions';
import { Button } from 'react-bootstrap';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const myStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const MyComponent = () => {
  // 현재 위치
  const [curPos, setCurPos] = useState(null);
  // 지도 확대 단계
  const [zoomLv, setZoomLv] = useState(10);

  // Directions에서 콜백
  const [gettingDest, setGettingDest] = useState();

  // 마커 선택하기 위함
  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
      if (marker === activeMarker) {
          return;
      }
      setActiveMarker(marker);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geolocSuccessHandler, geoLocError); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
}, []);

const geolocSuccessHandler = (response) => {
    const { latitude, longitude } = response.coords;
    setCurPos({latitude, longitude});
};

const geoLocError = (err) => {
    console.log("geoLocError = ", err)
}

  // 토글 기능
  const [swichDirections, setSwichDirections] = useState(false);

  const toggleDirections = (e) => {
    e.preventDefault();
    console.log("눌리긴 하니");
    // 만약에 토글이 null이 아니면 활성화, null이면 청소하고 비활성화
    setSwichDirections(!swichDirections)
  }


  return (
    <>
    {curPos &&
      <GoogleMap
        mapContainerStyle={containerStyle}
        // 지도 위치를 현재 위치로 이동
        center={{
          lat: curPos.latitude,
          lng: curPos.longitude
        }}
        // 지도 확대
        zoom={zoomLv}
        // 구글맵에서 제공하는 일부 기능 삭제
        options={{disableDefaultUI: true, styles: myStyles }}
      >
          <MarkerF 
          // 현재 위치를 마커로 표시함.
            position={ {
              lat: curPos.latitude,
              lng: curPos.longitude
            }} 
            icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
            onClick={() => handleActiveMarker(0)}
          >
            {/* 마커를 입력했을 때 정보창을 띄움 */}
            {activeMarker !== null &&
              <InfoWindow onCloseClick={() => setActiveMarker(null)}
                position={{ 
                  lat: curPos.latitude,
                  lng: curPos.longitude
                }}
              >
                <div align="Center">
                  내 위치 <br/>
                </div>
              </InfoWindow>
            }
          </MarkerF>
        <ShelterMarkers_google center={curPos} zoomLv={zoomLv} scale={50} gettingDest={gettingDest} setGettingDest={setGettingDest} />

        {/* 경로탐색 버튼을 누르면 */}
        {swichDirections &&
          // 만약 도착지점의 마커를 찍을 때에만 내 위치에서 도착지점까지의 경로를 탐색한다.
          <Directions 
            origin={{lat: curPos.latitude, lng: curPos.longitude}} 
            //destination={{lat: 37.485253, lng: 126.898051}}
            destination={{setGettingDest}}
          />
        }
      </GoogleMap>
    }
    <Button onClick={toggleDirections}>경로탐색</Button>
    </>
  )
}

export default memo(MyComponent)