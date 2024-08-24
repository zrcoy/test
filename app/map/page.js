'use client'
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api'
import { Spin, Button } from 'antd'
import { useState, useCallback, useEffect } from 'react'
import './map.css'

const MapPage = () => {
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 })
  const [loadingLocation, setLoadingLocation] = useState(true)

  const containerStyle = {
    width: '100%',
    height: '85vh',
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(
    function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center)
      map.fitBounds(bounds)
      setMap(map)
    },
    [center],
  )

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // setCenter({
          //   lat: position.coords.latitude,
          //   lng: position.coords.longitude,
          // })
          // TODO: set center back when finish
          setCenter({ lat: -3.745, lng: -38.523 })
          setLoadingLocation(false)
          console.log('User location:', position.coords)
        },
        () => {
          console.error('Error getting user location')
          setLoadingLocation(false)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser')
      setLoadingLocation(false)
    }
  }, [])

  return (
    <div className="map-container">
      <div className="actions-bar">
        <Button type="primary">Add</Button>
        <Button type="primary">Delete</Button>
        <Button type="primary">Edit</Button>
      </div>

      {isLoaded && !loadingLocation ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Child components, such as markers, info windows, etc. */}
        </GoogleMap>
      ) : (
        <div className="spinner">
          <Spin size="large" />
        </div>
      )}
    </div>
  )
}

export default MapPage
