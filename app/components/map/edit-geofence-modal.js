import { Modal, Select, Form } from 'antd'
import { useState, useEffect } from 'react'

const EditGeofenceModal = ({ isVisible, onOk, onCancel, polygons }) => {
  const { Option } = Select
  const [selectedPolygonId, setSelectedPolygonId] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isVisible) {
      form.resetFields()
      setSelectedPolygonId(null) // Corrected state reset
    }
  }, [isVisible, form])

  const handleSelectChange = (value) => {
    setSelectedPolygonId(value) // Set the selected polygon ID
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
        console.log('EditGeofenceModal->handleOK() Validate Failed:', info)
      })
  }

  return (
    <Modal
      title="Edit Geofence"
      open={isVisible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Start to Edit"
      okButtonProps={{ disabled: !selectedPolygonId }} // Based on selectedPolygonId
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="geofence"
          label="Select a Geofence to Edit"
          rules={[{ required: true, message: 'Please select a geofence!' }]}
        >
          <Select
            placeholder="Select a Geofence to Edit"
            onChange={handleSelectChange}
            allowClear
            style={{ width: '100%' }}
          >
            {polygons.map((polygon) => (
              <Option key={polygon.id} value={polygon.id}>
                {polygon.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditGeofenceModal
