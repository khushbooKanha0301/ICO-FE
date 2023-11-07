import React, { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'

export const Settings = () => {
  const [isVisibleOldPass, setVisibleOldPass] = useState(false)
  const toggleOldPass = () => {
    setVisibleOldPass(!isVisibleOldPass)
  }
  const [isVisibleNewPass, setVisibleNewPass] = useState(false)
  const toggleNewPass = () => {
    setVisibleNewPass(!isVisibleNewPass)
  }
  const [isVisibleConfirmPass, setVisibleConfirmPass] = useState(false)
  const toggleConfirmPass = () => {
    setVisibleConfirmPass(!isVisibleConfirmPass)
  }
  const [modalShow, setModalShow] = useState(false)
  const modalToggle = () => setModalShow(!modalShow)

  return (
    <Card body className="cards-dark">
      <Card.Title as="h2">Security Settings</Card.Title>
      <Form.Check type="switch" id="save-switch" label="Save my activities log" />
      <Form.Check type="switch" label="Alert me by email in case of unusual activity in my account" id="alert-switch" />
      <Button variant="primary">Update Profile</Button>
    </Card>
  )
}

export default Settings
