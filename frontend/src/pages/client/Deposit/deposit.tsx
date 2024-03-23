import { Col, Row } from "antd";
import React from "react";
import vnPayLogoUrl from '../../../assets/images/vnpay-logo.svg';

import './deposit.scss'
import { Link } from "react-router-dom";

const DepositMethods: React.FC = () => {
  return (
    <div className="payment-method-wrapper">
      <Row className="d-flex flex-column">
        <h3 className="payment-method-wrapper--title">Deposit money to account.</h3>
        <span className="payment-method-wrapper--desc">Choose one of following payment methods below</span>
        <Col span={8} style={{width: "100%"}}>
          <Link to={'/order/deposit/vnpay'} className="payment-method-wrapper__box" style={{textDecoration: "none"}}>
            <img src={vnPayLogoUrl} className="payment-method-wrapper__box--logo" alt="vnPay logo"/>
            <span className="payment-method-wrapper__box--desc">Deposit by VnPay</span>
          </Link>
        </Col>
      </Row>
    </div>
  )
}

export default DepositMethods;