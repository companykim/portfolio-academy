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

const MyComponent = ({Shelters}) => {
  const [curPos, setCurPos] = useState(null);
  const [zoomLv, setZoomLv] = useState(10);

  const [activeMarker, setActiveMarker] = useState(null);

  // 경로 탐색 toggle
  const [switchCalcRoute, setSwitchCalcRoute] = useState(null);
  
  const calcRouteToggle = (e) => {
    e.preventDefault();
    // 경로 탐색
    setSwitchCalcRoute(!switchCalcRoute);
  }

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

  return (
    <>
    {curPos &&
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{
          lat: curPos.latitude,
          lng: curPos.longitude
        }}
        zoom={zoomLv}
        options={{disableDefaultUI: true, styles: myStyles }}
      >
          <MarkerF 
            position={ {
              lat: curPos.latitude,
              lng: curPos.longitude
            }} 
            icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
            onClick={() => handleActiveMarker(0)}
          >
            {activeMarker !== null &&
              <InfoWindow onCloseClick={() => setActiveMarker(null)}
                position={{ 
                  lat: curPos.latitude,
                  lng: curPos.longitude
                }}
                xAnchor={0.3}
                yAnchor={0.5}
              >
                <div align="Center">
                  내 위치 <br/>
                </div>

              </InfoWindow>
            }
          </MarkerF>
        <ShelterMarkers_google center={curPos} zoomLv={zoomLv} scale={50} /> 

        {/* 경로탐색 버튼을 누르면 */}
        {switchCalcRoute !== null &&
          // 만약 도착지점의 마커를 찍을 때에만 내 위치에서 도착지점까지의 경로를 탐색한다.
          // 그러면 내가 할일은????
          <Directions origin={{lat: curPos.latitude, lng: curPos.longitude}} destination={{lat:37.498460, lng: 126.942430}}/>
        }
        
      </GoogleMap>
    }
    <Button onClick={calcRouteToggle}>경로탐색</Button>
    </>
  )
}

export default memo(MyComponent)