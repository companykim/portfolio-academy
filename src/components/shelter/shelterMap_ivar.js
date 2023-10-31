import React, { useState, useEffect } from 'react';
import { Map, Polyline, MapMarker, MapInfoWindow, CustomOverlayMap } from "react-kakao-maps-sdk"
import CustomOverlayStyle from 'style/CustomOverlayStyle';
import ShelterMarkers from './ShelterMarkers';
/**
 * 
 */
export default function ShelterMap_ivar() {
  const [curPos, setCurPos] = useState(null); // 현재 위치를 저장할 상태
  const [zoomLvl, setZoomLvl] = useState(3);  //1:코앞에 20M, 2:30M, 50M, 100M, 250M, 500M, 1KM, 2KM, 4KM, 8KM, 16KM, 32KM, 13:64KM, 14 128KM 동북아

  // 현재 위치를 ShelterMap을 생성할 때 준비해 줍니다.
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(geolocSuccessHandler, geoLocError); // 성공시 successHandler, 실패시 errorHandler 함수가 실행된다.
  }, []);

  const geolocSuccessHandler = (response) => {
    const { latitude, longitude } = response.coords;
    setCurPos({ latitude, longitude });
  };

  const geoLocError = (err) => {
    console.log("geoLocError = ", err)
  }

  // 거리재기 토글
  const [switchCalcDist, setSwitchCalcDist] = useState(false)
  const [pathJustAdded, setPathJustAdded] = useState(false)

  const [path, setPath] = useState([])
  const [pathMovingPt, setPathMovingPt] = useState(null)


  const calcDistToggle = (e) => {
    e.preventDefault();
    setSwitchCalcDist(!switchCalcDist)
    //기존 거리 측정 경로 청소
    setPath([])
  }

  const handleMove4Path = (_map, mouseEvent) => {
    if (!switchCalcDist || path.length === 0) {
      //경로 그리기 및 시작된 상태가 아니라면 무시
      return
    }
    //경로에 추가
    setPathMovingPt(  {
          lat: mouseEvent.latLng.getLat(),
          lng: mouseEvent.latLng.getLng(),
        })
  }

  // switchCalcDist로 설정되어 있으면 클릭한 위치를 바탕으로 경로 추가
  const addPath = (_map, mouseEvent) => {
    if (!switchCalcDist) {
      return
    }
    console.log("경로에 모인 지점은...", path)
    //경로에 추가
      setPath((prev) => [
        ...prev,
        {
          lat: mouseEvent.latLng.getLat(),
          lng: mouseEvent.latLng.getLng(),
        },
      ])
    }

  return (
    <>
      <CustomOverlayStyle />
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
          onClick={addPath}
          onMouseMove={handleMove4Path}
        >
          <MapMarker // 현재 위치 표시
            position={{
              lat: curPos.latitude,
              lng: curPos.longitude
            }}
          />
          <ShelterMarkers center={curPos} zoomLvl={zoomLvl} scale={50} />
          {switchCalcDist && path.length >= 1 ?
            <Polyline
              path={[...path, pathMovingPt]}
              strokeWeight={1} // 선의 두께입니다
              strokeColor={"#FF0080"} // 선의 색깔입니다
              strokeOpacity={1} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
              strokeStyle={"solid"} // 선의 스타일입니다
            />
            : <></>}
          <button onClick={calcDistToggle}>거리재기</button>
        </Map>
      }
    </>
  )
}