// Core
import React, { Component } from "react";
import { Link } from "react-router-dom";
//Instruments
import Styles from "./styles.m.css";

export default class Login extends Component {
    _login = () => {
        localStorage.setItem("isLogged", JSON.stringify(true));
        this.checkLogged();
    };
    render () {
        return (
            <section className = { Styles.login }>
                <Link to = '/feed' onClick = { this._login }>
                    {" "}
                    Login{" "}
                </Link>
            </section>
        );
    }
}
