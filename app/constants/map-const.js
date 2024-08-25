export const MapConst = {
  libraries: ['drawing', 'places'],
  defaultCenter: {
    lat: -3.745,
    lng: -38.523,
  },
  defaultContainerStyle: {
    width: '100%',
    height: '100%',
  },

  defaultPolygonOptions: (fillColor, borderColor) => ({
    fillColor: fillColor,
    fillOpacity: 0.5,
    strokeColor: borderColor,
    strokeWeight: 2,
    clickable: true,
    editable: true,
    draggable: true,
    zIndex: 1,
  }),

  defaultHighlightColors: {
    strokeColor: '#dd00ff',
    fillColor: '#dd00ff',
  },
}
