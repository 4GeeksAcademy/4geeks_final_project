import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/appContext";

export const ModalAddPayment = props => {
    const [inputDetail,setInputDetail] = useState("");
    const [inputAmount, setInputAmount] = useState("");
    const [inputDate, setInputDate] = useState("");
    const { store, actions } = useContext(Context);

    function handleAddPayment() {
        actions.addPayment(inputAmount, inputDate, inputDetail, props.clientId);
        props.onClose();
        setInputDetail("");
        setInputAmount("");
        setInputDate("");
    } 

    return (
        <div className="modal bg-secondary py-5" tabIndex="-1" role="dialog" style={{ display: props.show ? "inline-block" : "none" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Payment</h5>
                        {props.onClose ? (
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => props.onClose()}
                            ></button>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="modal-body">
                        <textarea
                            type="text"
                            className="form-control mb-1 border border-secondary"
                            placeholder="Detail"
                            onChange={e => setInputDetail(e.target.value)}
                            value={inputDetail}
                        />
                        <label htmlFor="priority" className="form-label d-flex justify-content-start align-items-start">Amount</label>
                        <input 
                                type="number"
                                className="form-control mb-1 border border-secondary" 
                                placeholder="Amount"
                                onChange={e => setInputAmount(e.target.value)}
								value={inputAmount} 
                            />
                        <label htmlFor="priority" className="form-label d-flex justify-content-start align-items-start">Date</label>
                        <input
                            type="date"
                            className="form-control mb-1 border border-secondary"
                            placeholder="Task date"
                            onChange={e => setInputDate(e.target.value)}
                            value={inputDate}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleAddPayment()}>
                            Add Payment
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => props.onClose()}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

ModalAddPayment.propTypes = {
    onClose: PropTypes.func,
    show: PropTypes.bool,
};

ModalAddPayment.defaultProps = {
    show: false,
    onClose: null
};