import React, { useState, useEffect } from 'react'
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import ShelterMarkers_google from './ShelterMarkers_google';

const containerStyle = {
  width: '100%',
  height: '600px'
};

export default function MyComponent() {
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
        mapContainerStyle={containerStyle}
        center={{
          lat: curPos.latitude,
          lng: curPos.longitude
        }}
        zoom={zoomLv}
        options={{disableDefaultUI: true}}
      >
          <MarkerF 
            position={{
              lat: curPos.latitude,
              lng: curPos.longitude
            }} 
            icon={"https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"}
            clickable={true}
            removable={true}
            onMouseOver={() => setIsOpen(true)}
            onMouseOut={() => setIsOpen(false)}
          >
          {isOpen && (<div style={{ minWidth: "150px" }}>
            <div style={{ padding: "5px", color: "#000", textAlign: "center" }}>내 위치</div>
          </div>)}
          </MarkerF>

        <ShelterMarkers_google center={curPos} zoomLv={zoomLv} scale={50} /> 
      </GoogleMap>
    }
    </>
  )
}