import { useState, useEffect, useRef, useCallback } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import { MapConst } from '../constants/map-const'
import { v4 as uuidv4 } from 'uuid'

export const useGeofence = () => {
  const [name, setName] = useState('')
  const [borderColor, setBorderColor] = useState('#FF0000')
  const [fillColor, setFillColor] = useState('#FF0000')
  const [userLocation, setUserLocation] = useState(null)
  // One modal is good enough, because we can use the same modal for both Add and Edit and Delete
  const [modal, setModal] = useState({ visible: false, type: null })
  const drawingManagerRef = useRef(null)
  const mapRef = useRef(null)
  const [activeAction, setActiveAction] = useState(null)
  const currentEditingPolygonRef = useRef(null)
  const originalPolygonColors = useRef({})
  const revertLatestPolygonRef = useRef(false)
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: MapConst.libraries,
  })

  // Load polygons from localStorage when initializing the state
  const loadPolygons = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedPolygons = localStorage.getItem('geofencePolygons')
      return savedPolygons ? JSON.parse(savedPolygons) : []
    }
    return []
  }
  const [polygons, setPolygons] = useState(loadPolygons)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.error('Error getting user location')
        },
      )
    }
  }, [])

  // Save polygons to localStorage whenever they change, if available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const simplifiedPolygons = polygons.map(
        ({ id, name, borderColor, fillColor, path }) => ({
          id,
          name,
          borderColor,
          fillColor,
          path,
        }),
      )
      localStorage.setItem(
        'geofencePolygons',
        JSON.stringify(simplifiedPolygons),
      )
    }
  }, [polygons])

  const recreate = () => {}

  // Recreate polygons on the map when the component mounts
  const onMapLoad = useCallback(() => {
    if (mapRef.current && isLoaded) {
      polygons.forEach((polygonData) => {
        if (!polygonData.ref) {
          const polygon = new window.google.maps.Polygon({
            paths: polygonData.path,
            strokeColor: polygonData.borderColor,
            fillColor: polygonData.fillColor,
            map: mapRef.current,
          })

          polygon.setOptions({
            editable: false,
            draggable: false,
          })

          // Update the polygons with a reference to the polygon on the map
          polygonData.ref = polygon
        }
      })

      // Force an update to the polygons array to ensure it is in sync
      setPolygons([...polygons])
    }
  }, [polygons, isLoaded])

  // AddModal state management related
  const handleAddOk = () => {
    setModal({ visible: false, type: null })
    setActiveAction('add')
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({
        drawingMode: 'polygon',
        polygonOptions: MapConst.defaultPolygonOptions(fillColor, borderColor),
      })
    }
  }

  // EditModal state management related
  const handleEditOk = (selectedPolygon) => {
    setModal({ visible: false, type: null })
    setActiveAction('edit')
    const polygonToEdit = polygons.find(
      (polygon) => polygon.id === selectedPolygon.id,
    )

    if (polygonToEdit && polygonToEdit.ref) {
      polygonToEdit.ref.setOptions({
        editable: true,
        draggable: true,
        clickable: true,
      })
      currentEditingPolygonRef.current = polygonToEdit.ref
    }
  }

  // DeleteModal state management related
  const handleDeleteOk = (selectedPolygon) => {
    setModal({ visible: false, type: null })
    setActiveAction('delete')
    const polygonToDelete = polygons.find(
      (polygon) => polygon.id === selectedPolygon.id,
    )
    if (polygonToDelete && polygonToDelete.ref) {
      // Store the original colors
      originalPolygonColors.current = {
        strokeColor: polygonToDelete.ref.get('strokeColor'),
        fillColor: polygonToDelete.ref.get('fillColor'),
      }

      polygonToDelete.ref.setOptions(MapConst.defaultHighlightColors)

      currentEditingPolygonRef.current = polygonToDelete.ref // Store reference to the polygon instance (ref) to be deleted
    }
  }

  // Handle completion of polygon drawing
  const onPolygonComplete = useCallback(
    (polygon) => {
      if (revertLatestPolygonRef.current) {
        polygon.setMap(null)
        revertLatestPolygonRef.current = false
        return
      }
      const path = polygon
        .getPath()
        .getArray()
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }))
      const newPolygon = {
        id: uuidv4(),
        name: name,
        fillColor,
        borderColor,
        path,
        ref: polygon,
      }
      setPolygons((prevPolygons) => [...prevPolygons, newPolygon])
      polygon.setOptions({
        editable: false,
        draggable: false,
        clickable: false,
      })

      resetAction()
    },
    [borderColor, fillColor, name, setPolygons],
  )

  const handleComplete = () => {
    // Instead of retrieving the points from the polygon to connect first and last point, we can do this trick
    // Set drawingManager's mode to be null
    if (activeAction === 'add') {
      resetAction()
      return
    }
    if (activeAction === 'edit' && currentEditingPolygonRef.current) {
      currentEditingPolygonRef.current.setOptions({
        editable: false,
        draggable: false,
        clickable: false,
      })
    } else if (activeAction === 'delete' && currentEditingPolygonRef.current) {
      currentEditingPolygonRef.current.setMap(null)
      setPolygons((prevPolygons) =>
        prevPolygons.filter(
          (polygon) => polygon.ref !== currentEditingPolygonRef.current,
        ),
      )
    }

    resetAction()
  }

  // Handle cancellation of an active action
  const handleCancel = () => {
    if (activeAction === 'add') {
      revertLatestPolygonRef.current = true
    } else if (activeAction === 'edit' && currentEditingPolygonRef.current) {
      currentEditingPolygonRef.current.setOptions({
        editable: false,
        draggable: false,
        clickable: false,
      }) // Revert changes to the polygon
    } else if (activeAction === 'delete' && currentEditingPolygonRef.current) {
      currentEditingPolygonRef.current.setOptions({
        strokeColor: originalPolygonColors.current.strokeColor,
        fillColor: originalPolygonColors.current.fillColor,
      })
    }

    resetAction()
  }

  const resetAction = () => {
    setActiveAction(null)
    currentEditingPolygonRef.current = null
    originalPolygonColors.current = {}
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setOptions({ drawingMode: null })
    }
  }

  const showModal = (type) => {
    setModal({ visible: true, type })
    if (drawingManagerRef.current)
      drawingManagerRef.current.setOptions({ drawingMode: null })
  }

  const closeModal = () => {
    setModal({ visible: false, type: null })
    setActiveAction(null)
    if (drawingManagerRef.current)
      drawingManagerRef.current.setOptions({ drawingMode: null })
  }

  return {
    isLoaded,
    name,
    setName,
    borderColor,
    setBorderColor,
    fillColor,
    setFillColor,
    polygons,
    setPolygons,
    userLocation,
    showModal,
    closeModal,
    modal,
    handleAddOk,
    handleEditOk,
    drawingManagerRef,
    handleComplete,
    handleCancel,
    activeAction,
    onPolygonComplete,
    handleDeleteOk,
    mapRef,
    onMapLoad,
  }
}
