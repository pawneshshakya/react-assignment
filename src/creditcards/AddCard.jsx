import React, { useRef, useState } from "react";
import Card from "react-credit-cards";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "_helpers";

import "react-credit-cards/es/styles-compiled.css";
import { useDispatch } from "react-redux";
import { cardActions } from "_store";

const AddCard = () => {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focused, setFocused] = useState("");
  const [issuer, setIssuer] = useState("");
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const handleCallback = ({ issuer }, isValid) => {
    if (issuer === "amex") setIssuer("AE");
    else if (issuer === "visa") setIssuer("VISA");
    else if (issuer === "mastercard") setIssuer("MC");
  };

  const handleInputFocus = ({ target }) => {
    setFocused(target.name);
  };

  const handleInputChange = ({ target }) => {
    if (target.name === "cardNumber") {
      target.value = formatCreditCardNumber(target.value);
      setNumber(target.value);
    } else if (target.name === "cardExpiration") {
      target.value = formatExpirationDate(target.value);
      setExpiry(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
      setCvc(target.value);
    } else if (target.name === "cardHolder") {
      setName(target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = [...e.target.elements]
      .filter((d) => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});
    console.log(formData);
    delete formData.cvc;
    dispatch(cardActions?.addCard(formData));
    formRef.current.reset();
  };

  return (
    <div>
      <Card
        number={number}
        name={name}
        expiry={expiry}
        cvc={cvc}
        focused={focused}
        callback={handleCallback}
      />
      <form ref={formRef} className="mt-5" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="tel"
            name="cardNumber"
            className="form-control"
            placeholder="Card Number"
            pattern="[\d| ]{16,22}"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <small>E.g.: 49..., 51..., 36..., 37...</small>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="cardHolder"
            className="form-control"
            placeholder="Name"
            required
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <input
            type="hidden"
            name="name"
            className="form-control"
            placeholder="Name"
            required
            value={name}
          />
        </div>
        <div className="row">
          <div className="col-6">
            <input
              type="tel"
              name="cardExpiration"
              className="form-control"
              placeholder="Valid Thru"
              pattern="\d\d/\d\d"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="col-6">
            <input
              type="tel"
              name="cvc"
              className="form-control"
              placeholder="CVC"
              pattern="\d{3,4}"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
        </div>
        <input type="hidden" name="category" value={issuer} />
        <div className="form-actions">
          <button className="btn btn-primary btn-block mt-3">PAY</button>
        </div>
      </form>
    </div>
  );
};

export { AddCard };
