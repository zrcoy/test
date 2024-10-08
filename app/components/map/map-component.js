'use client'
import { useEffect } from 'react'
import { GoogleMap, DrawingManager } from '@react-google-maps/api'
import '../../map/map.css'
import { Spin } from 'antd'
import { MapConst } from '../../constants/map-const'

const MapComponent = ({
  isLoaded,
  userLocation,
  drawingManagerRef,
  onPolygonComplete,
  mapRef,
  onMapLoad,
}) => {
  useEffect(() => {
    const loadAdvancedMarker = async () => {
      const { AdvancedMarkerElement } =
        await google.maps.importLibrary('marker')

      if (userLocation && mapRef.current) {
        new AdvancedMarkerElement({
          map: mapRef.current,
          position: userLocation,
          title: 'Your Location',
        })
      }
    }
    if (isLoaded && userLocation) {
      loadAdvancedMarker()
    }
  }, [isLoaded, mapRef, userLocation])

  if (!isLoaded) {
    return (
      <div className="spinner">
        <Spin size="large" fullscreen={true} />
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={MapConst.defaultContainerStyle}
      center={userLocation || MapConst.defaultCenter}
      zoom={10}
      onLoad={(map) => {
        mapRef.current = map
        onMapLoad()
      }}
      options={{ mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID }}
    >
      <DrawingManager
        onPolygonComplete={onPolygonComplete}
        onLoad={(dm) => (drawingManagerRef.current = dm)}
        options={{ drawingControl: false }}
      />
    </GoogleMap>
  )
}

export default MapComponent
