'use client'

import { useEffect, useState } from 'react'
import { Table, Checkbox, Button, Input } from 'antd'
import { useGeofence } from '../hooks/use-geofence'
import './list.css'

const ListPage = () => {
  const { polygons, setPolygons } = useGeofence()
  const [isClient, setIsClient] = useState(false)
  const [filteredPolygons, setFilteredPolygons] = useState(polygons)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  // Ensure this only runs on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setFilteredPolygons(polygons)
  }, [polygons])

  const handleDeleteSelected = () => {
    const newPolygons = polygons.filter(
      (polygon) => !selectedRowKeys.includes(polygon.id),
    )
    setPolygons(newPolygons)
    localStorage.setItem('geofencePolygons', JSON.stringify(newPolygons))
    setSelectedRowKeys([])
  }

  const handleFilter = (e) => {
    const searchText = e.target.value.toLowerCase()
    const filteredData = polygons.filter((polygon) =>
      polygon.name.toLowerCase().includes(searchText),
    )
    setFilteredPolygons(filteredData)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => text || 'Unnamed Geofence',
    },
    {
      title: 'Border Color',
      dataIndex: 'borderColor',
      key: 'borderColor',
      render: (color) => (
        <div className="color-cell">
          <div className="color-circle" style={{ backgroundColor: color }} />
          {color}
        </div>
      ),
    },
    {
      title: 'Fill Color',
      dataIndex: 'fillColor',
      key: 'fillColor',
      render: (color) => (
        <div className="color-cell">
          <div className="color-circle" style={{ backgroundColor: color }} />
          {color}
        </div>
      ),
    },
    {
      title: 'Added Date',
      dataIndex: 'addedDate',
      key: 'addedDate',
    },
    {
      title: 'Coordinates',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
      render: (path) => (
        <span>
          {path.map((coord) => `(${coord.lat}, ${coord.lng})`).join(', ')}
        </span>
      ),
    },
    {
      title: 'Display on Map',
      dataIndex: 'displayOnMap',
      key: 'displayOnMap',
      render: (_, record) => (
        <div className="display-checkbox-cell">
          <Checkbox
            checked={record.displayOnMap}
            onChange={(e) => {
              const updatedPolygons = polygons.map((polygon) =>
                polygon.id === record.id
                  ? { ...polygon, displayOnMap: e.target.checked }
                  : polygon,
              )
              setPolygons(updatedPolygons)
              localStorage.setItem(
                'geofencePolygons',
                JSON.stringify(updatedPolygons),
              )
            }}
          />
        </div>
      ),
    },
  ]

  // Avoid rendering during server-side rendering (SSR) to prevent hydration issues
  if (!isClient) {
    return null
  }

  return (
    <div className="list-page-container">
      <Input
        placeholder="Filter by name"
        onChange={handleFilter}
        style={{ marginBottom: '16px', width: '300px', textAlign: 'center' }}
      />
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={filteredPolygons}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <Button
        type="primary"
        onClick={handleDeleteSelected}
        disabled={selectedRowKeys.length === 0}
        style={{ marginTop: '16px' }}
      >
        Delete Selected
      </Button>
    </div>
  )
}

export default ListPage
