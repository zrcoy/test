'use client'

import { Button } from 'antd'
import MapComponent from '../components/map/map-component'
import AddGeofenceModal from '../components/map/add-geofence-modal'
import { useGeofence } from '../hooks/use-geofence'
import './map.css'
import EditGeofenceModal from '../components/map/edit-geofence-modal'
import DeleteGeofenceModal from '../components/map/delete-geofence-modal'

const MapPage = () => {
  // Custom hook to handle geofence state
  const {
    isLoaded,
    name,
    setName,
    borderColor,
    setBorderColor,
    fillColor,
    setFillColor,
    polygons,
    userLocation,
    showModal,
    closeModal,
    modal,
    handleAddOk,
    handleEditOk,
    drawingManagerRef,
    handleComplete,
    activeAction,
    onPolygonComplete,
    handleDeleteOk,
    handleCancel,
    mapRef,
    onMapLoad,
  } = useGeofence()

  return (
    <div className="map-container">
      <div className="actions-bar-container">
        <div className="actions-bar">
          <Button
            type="primary"
            onClick={() => showModal('add')}
            disabled={activeAction !== null}
          >
            Add
          </Button>
          <Button
            type="primary"
            onClick={() => showModal('edit')}
            disabled={activeAction !== null}
          >
            Edit
          </Button>
          <Button
            type="primary"
            onClick={() => showModal('delete')}
            disabled={activeAction !== null}
          >
            Delete
          </Button>
        </div>

        {activeAction && (
          <div className="confirm-actions-bar">
            <Button type="primary" onClick={handleComplete}>
              Complete
            </Button>
            {/*TODO: revert for edit tbd*/}
            <Button
              type="default"
              onClick={handleCancel}
              disabled={activeAction === 'edit'}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {modal.type === 'add' && (
        <AddGeofenceModal
          isVisible={modal.visible}
          onOk={handleAddOk}
          onCancel={closeModal}
          name={name}
          setName={setName}
          borderColor={borderColor}
          setBorderColor={setBorderColor}
          fillColor={fillColor}
          setFillColor={setFillColor}
          polygons={polygons}
        />
      )}

      {modal.type === 'edit' && (
        <EditGeofenceModal
          isVisible={modal.visible}
          onOk={handleEditOk}
          onCancel={closeModal}
          polygons={polygons}
        />
      )}

      {modal.type === 'delete' && (
        <DeleteGeofenceModal
          isVisible={modal.visible}
          onOk={handleDeleteOk}
          onCancel={closeModal}
          polygons={polygons}
        />
      )}

      <MapComponent
        onMapLoad={onMapLoad}
        mapRef={mapRef}
        isLoaded={isLoaded}
        userLocation={userLocation}
        drawingManagerRef={drawingManagerRef}
        onPolygonComplete={onPolygonComplete}
      />
    </div>
  )
}
export default MapPage
