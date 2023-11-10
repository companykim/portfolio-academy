import { useRef, useState } from 'react'
import { MarkerF } from '@react-google-maps/api';

function AutoComplete({setPlacelating}) {
  const inputRef = useRef()

  const inputStyle= {
    boxShadow: 'inset 0 0 10px #eee !important',
    border: '2px solid #eee',
    width: '456px',
    height: '40px',
    marginLeft: '16px',
    borderRadius: '20px',
    fontWeight: '300 !important',
    outline: 'none',
    padding: '10px 20px',
    marginBottom: '10px',
  }

  const autoComplete = new window.google.maps.places.Autocomplete(
    inputRef.current,
  )

  autoComplete.addListener('place_changed', () => {
    const place = autoComplete.getPlace()
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
        alert("this location not available")
    }
    if (place.geometry.viewport || place.geometry.location) {
        console.log(place.geometry.location.lat());
        console.log(place.geometry.location.lng());
        setPlacelating({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})
    }
    return (
        <MarkerF
            position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }}
        />
    )
  })

    return (
      <div>
      <label>Location</label>
        <input 
          placeholder='장소를 입력하세요'
          ref={inputRef}
          style={inputStyle}
        />
      </div>
    );
}

export default AutoComplete;