import React, { useState, useEffect } from 'react'
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import ShelterMarkers_google from './ShelterMarkers_google';

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

function MyComponent() {
  const [curPos, setCurPos] = useState(null);
  const [zoomLv, setZoomLv] = useState(10);
  const [isOpen, setIsOpen] = useState(false);

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
        center={{
          lat: curPos.latitude,
          lng: curPos.longitude
        }}
        mapContainerStyle={containerStyle}
        zoom={zoomLv}
        options={{ disableDefaultUI: true, styles: myStyles }}
      >
          <MarkerF 
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
          />

        <ShelterMarkers_google center={curPos} zoomLv={zoomLv} scale={50} /> 
      </GoogleMap>
    }
    </>
  )
}

export default React.memo(MyComponent)