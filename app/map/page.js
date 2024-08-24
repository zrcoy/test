'use client'
import { useJsApiLoader, GoogleMap, Polygon } from '@react-google-maps/api'
import { Spin, Button, Modal, Input, Select } from 'antd'
import { useState, useCallback, useEffect } from 'react'
import './map.css'

const MapPage = () => {
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 })
  const [loadingLocation, setLoadingLocation] = useState(true)
  const [geofences, setGeofences] = useState([])
  const [drawing, setDrawing] = useState(false)
  const [currentGeofence, setCurrentGeofence] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [geofenceProps, setGeofenceProps] = useState({
    name: '',
    borderColor: '#FF0000',
    fillColor: '#FF0000',
  })
  console.log('geofences:', geofences)
  console.log('currentGeofence:', currentGeofence)
  console.log('geofenceProps:', geofenceProps)

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

  const handleMapClick = (event) => {
    if (drawing) {
      setCurrentGeofence([
        ...currentGeofence,
        { lat: event.latLng.lat(), lng: event.latLng.lng() },
      ])
    }
  }

  const handleAddGeofence = () => {
    setIsModalVisible(true)
  }

  const handleStartDrawing = () => {
    setDrawing(true)
    setIsModalVisible(false)
  }

  const handleCompleteGeofence = () => {
    setGeofences([...geofences, { ...geofenceProps, path: currentGeofence }])
    setCurrentGeofence([])
    setDrawing(false)
  }

  const handleModalChange = (e) => {
    const { name, value } = e.target
    setGeofenceProps({ ...geofenceProps, [name]: value })
  }

  return (
    <div className="map-container">
      <div className="actions-bar">
        <div style={{ fontSize: 30, marginRight: 30 }}>Geofences</div>
        <Button type="primary" onClick={handleAddGeofence}>
          Add
        </Button>
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
          onClick={handleMapClick}
        >
          {geofences.map((geofence, index) => (
            <Polygon
              key={index}
              paths={geofence.path}
              options={{
                fillColor: geofence.fillColor,
                fillOpacity: 0.4,
                strokeColor: geofence.borderColor,
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          ))}
          {drawing && (
            <Polygon
              paths={currentGeofence}
              options={{
                fillColor: geofenceProps.fillColor,
                fillOpacity: 0.4,
                strokeColor: geofenceProps.borderColor,
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <div className="spinner">
          <Spin size="large" />
        </div>
      )}

      <Modal
        title="Add Geofence"
        open={isModalVisible}
        onOk={handleStartDrawing}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input name="name" placeholder="Name" onChange={handleModalChange} />
        <Input
          name="borderColor"
          placeholder="Border Color"
          onChange={handleModalChange}
        />
        <Input
          name="fillColor"
          placeholder="Fill Color"
          onChange={handleModalChange}
        />
      </Modal>

      {drawing && (
        <Button type="primary" onClick={handleCompleteGeofence}>
          Complete
        </Button>
      )}
    </div>
  )
}

export default MapPage
