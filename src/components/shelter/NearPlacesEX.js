import { Marker, InfoWindow } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { Fetch } from 'toolbox/Fetch';
import { Dropdown, DropdownButton } from 'react-bootstrap';

export default function NearPlacesEX({ lat, lng, radius, zoomLv }) {
    const nearPlacesURL = `http://localhost:8080/shelter/places/${lat}/${lng}/${radius}`;

    const [activeMarker, setActiveMarker] = useState(null);
    const [placeType, setPlaceType] = useState(null);

    const shouldShowMarker = (zoomLv) => {
        return zoomLv <= 8;
    };

    function setPlaceUsetype(item) {
        setPlaceType(item);
    }

    const handleInfo = (chosenMarker) => {
        if (chosenMarker === activeMarker) {
            return;
        }
        setActiveMarker(chosenMarker);
    };

    const RenderSuccessPlace = (nearPlaces) => {
        return (
            <>
                {nearPlaces?.map((nearPlace) => (
                    <>
                        {(placeType === "hospital" && nearPlace.type === "hospital") ||
                         (placeType === "pharmacy" && nearPlace.type === "pharmacy") ? (
                            <Marker
                                position={{
                                    lat: nearPlace.placeLat,
                                    lng: nearPlace.placeLng
                                }}
                                icon={{
                                    url: placeType === "hospital"
                                        ? "https://cdn-icons-png.flaticon.com/128/4959/4959669.png"
                                        : "https://cdn-icons-png.flaticon.com/128/8059/8059164.png",
                                    scaledSize: {
                                        width: 30,
                                        height: 30,
                                    }
                                }}
                                onClick={() => handleInfo(nearPlace)}
                            />
                        ) : null}
                    </>
                ))}
                {activeMarker !== null && (
                    <InfoWindow
                        position={{
                            lat: activeMarker.placeLat,
                            lng: activeMarker.placeLng
                        }}
                        onCloseClick={() => setActiveMarker(null)}
                    >
                        <div align="Center">
                            {activeMarker.name} <br />
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${activeMarker.placeLat},${activeMarker.placeLng}`}
                                style={{ color: "blue" }}
                                target="_blank"
                                rel="noreferrer"
                            >
                                길찾기
                            </a>
                        </div>
                    </InfoWindow>
                )}
            </>
        );
    };

    return (
        <>
            <DropdownButton id="dropdown-basic-button" title="근처 장소 찾기" onSelect={setPlaceUsetype} >
                <Dropdown.Item eventKey="hospital">병원</Dropdown.Item>
                <Dropdown.Item eventKey="pharmacy">약국</Dropdown.Item>
            </DropdownButton>
            {placeType && <Fetch uri={`${nearPlacesURL}/${placeType}`} renderSuccess={RenderSuccessPlace} />}
        </>
    );
}