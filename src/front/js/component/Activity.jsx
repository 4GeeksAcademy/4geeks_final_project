import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import Logo from "../../img/Logo.png"
import "../../styles/activity.css";

export const Activity = (props) => {
    const { store, actions } = useContext(Context);
    const [state, setState] = useState([]);
    // const filteredNotes = store.notes.filter(note => note.client_id === props.clientId);
    // const filteredTasks = store.tasks.filter(note => note.client_id === props.clientId);
    // const filteredPayments = store.payments.filter(note => note.client_id === props.clientId);



    return (

        <>

            <div className="container d-flex flex-column justify-content-center align-items-center m-4 w-100">
                <ul id="activityScroll">
                    {store.activity.map((activity, index) => {
                        return (
                            <li className="border border-dark p-5 my-2 d-flex justify-content-end row bg-light" style={{ width: '30rem' }} key={index}>
                                <span className="col-6">{activity.activity}</span>
                                <span className="col-6">Date created: {activity.date}</span>
                            </li>
                        );
                    })}

                </ul>

            </div>
        </>

    )
}
