import React from 'react'
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap'

export const StakeScallopPage = () => {
  return (
    <div className="stake-scallop-view">
      <Row>
        <Col lg="8">
          <Card body className="cards-dark">
            <Card.Title as="h4">Stake Scallop</Card.Title>
            <Form.Group className="form-group">
              <div className="d-flex justify-content-between">
                <div>
                  <Form.Label>Referral URL</Form.Label>
                  <Form.Control type="text" placeholder="0.000" />
                </div>
                <div className="text-end">
                  <Form.Label>Balance : 0 ICO</Form.Label>
                  <div className="d-flex align-items-center balance-ico">
                    <Badge bg="success">Max</Badge>
                    <div className="token-type">
                      <span className="token-icon"></span>Token
                    </div>
                  </div>
                </div>
              </div>
            </Form.Group>
            <Card.Title as="h4">Select Locking Period January 27, 2023 - January 27, 2027</Card.Title>
            <div className="locking-period">
              <Form.Check type="radio" name="lockingperiod" id="lockingperiod1" label="1 M" />
              <Form.Check type="radio" name="lockingperiod" id="lockingperiod2" label="2 M" />
              <Form.Check type="radio" name="lockingperiod" id="lockingperiod3" label="3 M" />
              <Form.Check type="radio" name="lockingperiod" id="lockingperiod4" label="6 M" />
              <Form.Check type="radio" name="lockingperiod" id="lockingperiod5" label="1 Y" />
              <Form.Check type="radio" name="lockingperiod" id="lockingperiod6" label="2 Y" />
              <Form.Check type="radio" name="lockingperiod" id="lockingperiod7" label="3 Y" />
              <Form.Check type="radio" name="lockingperiod" id="lockingperiod8" label="4 Y" />
            </div>
            <Card.Title as="h4" className="estimated-apr">
              <span>
                Estimated APR <span className="text-muted">(APR Subject to change)</span>
              </span>{' '}
              <span>0%</span>
            </Card.Title>
            <Card.Text>
              To be eligible to get Elite Membership Benefits and USD$2500. Click here to learn more about Elite
              Membership.
            </Card.Text>
            <div className="form-action-group">
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Review Stake</Button>
            </div>
          </Card>
        </Col>
        <Col lg="4">
          <Card body className="cards-dark steps-staking">
            <Card.Title as="h4">3 Steps to Staking Token</Card.Title>
            <ul>
              <li className="d-flex align-items-center">Watch how to setup Metamask on youtube.</li>
              <li className="d-flex align-items-center">Watch how to buy Token from KuCoin.</li>
              <li className="d-flex align-items-center">Watch how to stake Token on Scallop app.</li>
            </ul>
            <Button variant="primary">Watch on youtube</Button>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default StakeScallopPage
