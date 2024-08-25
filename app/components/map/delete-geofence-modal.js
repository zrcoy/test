'use client'
import React, { useState } from 'react'
import { Modal, Form, Select } from 'antd'

const { Option } = Select

const DeleteGeofenceModal = ({ isVisible, onOk, onCancel, polygons }) => {
  const [selectedPolygonId, setSelectedPolygonId] = useState(null)
  const [form] = Form.useForm()

  const handleSelectChange = (value) => {
    setSelectedPolygonId(value)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        if (selectedPolygonId) {
          const selectedPolygon = polygons.find(
            (polygon) => polygon.id === selectedPolygonId,
          )
          onOk(selectedPolygon)
          setSelectedPolygonId(null)
          form.resetFields()
        }
      })
      .catch((info) => {
        console.log('DeleteGeofenceModal->handleOK() Validate Failed:', info)
      })
  }

  const handleCancel = () => {
    onCancel()
    setSelectedPolygonId(null)
    form.resetFields()
  }

  return (
    <Modal
      title="Delete Geofence"
      open={isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ disabled: !selectedPolygonId }}
      okText="Start to Delete"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="geofence"
          label="Select a geofence to delete"
          rules={[{ required: true, message: 'Please select a geofence!' }]}
        >
          <Select
            placeholder="Select a geofence to delete"
            style={{ width: '100%' }}
            onChange={handleSelectChange}
          >
            {polygons.map((polygon) => (
              <Option key={polygon.id} value={polygon.id}>
                {polygon.name || 'Unnamed Geofence'}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DeleteGeofenceModal
