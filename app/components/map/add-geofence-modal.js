import { Modal, Input, Form, ColorPicker } from 'antd'
import { useEffect } from 'react'
import '../../map/map.css'

const AddGeofenceModal = ({
  isVisible,
  onOk,
  onCancel,
  name,
  setName,
  borderColor,
  setBorderColor,
  fillColor,
  setFillColor,
  polygons, // Add polygons as a prop to access the existing names
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    // Reset form when modal is closed or opened
    if (isVisible) {
      form.resetFields()
    }
  }, [isVisible, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values) // Pass form values to onOk
        form.resetFields()
      })
      .catch((info) => {
        console.log('AddGeofenceModal->handleOK() Validate Failed:', info)
      })
  }

  return (
    <Modal
      title="Add Geofence"
      open={isVisible}
      okText="Start to Draw"
      onOk={handleOk}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: name,
          borderColor: borderColor,
          fillColor: fillColor,
        }}
      >
        <Form.Item
          name="name"
          label="Geofence Name"
          rules={[
            { required: true, message: 'Please input the geofence name!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  !polygons.some((polygon) => polygon.name === value)
                ) {
                  return Promise.resolve()
                }
                return Promise.reject(
                  new Error('Geofence name must be unique!'),
                )
              },
            }),
          ]}
        >
          <Input
            placeholder="Geofence Name"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        <Form.Item name="borderColor" label="Border Color">
          <ColorPicker
            style={{ border: 'unset', alignSelf: 'flex-start' }}
            value={borderColor}
            onChange={(color) => setBorderColor(color.toHexString())}
            allowClear={true}
            showText={(color) => <span>{color.toHexString()}</span>}
          />
        </Form.Item>

        <Form.Item name="fillColor" label="Fill Color">
          <ColorPicker
            style={{ border: 'unset', alignSelf: 'flex-start' }}
            value={fillColor}
            allowClear={true}
            onChange={(color) => setFillColor(color.toHexString())}
            showText={(color) => <span>{color.toHexString()}</span>}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddGeofenceModal
