// Core
import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Switch, Route, Redirect } from "react-router-dom";

//Components
import Catcher from "components/Catcher";
import Feed from "components/Feed";
import Profile from "components/Profile";
import Login from "components/Login";
import { Provider } from "components/HOC/withProfile";
import StatusBar from "components/StatusBar";

//Instruments
import avatar from "theme/assets/lisa";
import { getIsLogged } from "instruments/index.js";

const options = {
    avatar,
    currentUserFirstName: "Анна",
    currentUserLastName:  "Гурова",
};

@hot(module)
export default class App extends Component {
    state = {
        isLogged: false,
    };

    componentDidMount () {
        this.setState({
            isLogged: getIsLogged(),
        });
    }
    _checkLogged = () => {
        if (this.state.isLogged) {
            if (!getIsLogged()) {
                this.setState({
                    isLogged: getIsLogged(),
                });
            }
        } else if (getIsLogged()) {
            this.setState({
                isLogged: getIsLogged(),
            });
        }
    };

    render () {
        let jsx;
        const { isLogged } = this.state;

        if (isLogged) {
            jsx = (
                <Catcher>
                    <Provider value = { options }>
                        <StatusBar
                            checkLogged = { this._checkLogged }
                            isLogged = { this.state.isLogged }
                        />
                        <Switch>
                            <Route component = { Feed } path = '/feed' />
                            <Route component = { Profile } path = '/profile' />
                            <Redirect to = '/feed' />
                        </Switch>
                    </Provider>
                </Catcher>
            );
        } else {
            jsx = (
                <Catcher>
                    <Provider value = { options }>
                        <StatusBar isLogged = { this.state.isLogged } />
                        <Switch>
                            <Route
                                checkLogged = { this._checkLogged }
                                component = { Login }
                                path = '/login'
                            />
                            <Redirect from = '/' to = '/login' />
                        </Switch>
                    </Provider>
                </Catcher>
            );
        }

        return jsx;
    }
}
