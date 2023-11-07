import React, { memo, useState, useEffect } from 'react'
import { GoogleMap, MarkerF, InfoWindow } from '@react-google-maps/api';
import ShelterMarkers_google from './ShelterMarkers_google';
import Directions from './Directions';

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
  const [curPos, setCurPos] = useState(null);
  const [zoomLv, setZoomLv] = useState(10);

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
      </GoogleMap>
    }
    </>
  )
}

export default memo(MyComponent)