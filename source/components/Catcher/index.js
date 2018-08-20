//Core
import React, { Component } from "react";
import { object } from "prop-types";

// instruments
import Styles from "./styles.m.css";

export default class Catcher extends Component {
    static propTypes = {
        children: object.isRequired,
    };
    state = {
        error: false,
    };

    componentDidCatch (error, stack) {
        console.log("ERROR:", error);
        console.log("STACKTRACE:", stack.componentStack);
        this.setState({
            error: true,
        });
    }
    render () {
        const { error } = this.state;

        if (error) {
            return (
                <section className = { Styles.catcher }>
                    <span>A mysterious error occured</span>
                    <p>Our space engineers fixing that aldeary</p>
                </section>
            );
        }

        return this.props.children;
    }
}
