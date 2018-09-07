// Core
import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Switch, Route, Redirect } from 'react-router-dom';

//Components
import Catcher from "components/Catcher";
import Feed from "components/Feed";
import Profile from "components/Profile";
import Login from "components/Login";
import { Provider } from "components/HOC/withProfile";
import StatusBar from "components/StatusBar";

//Instruments
import avatar from "theme/assets/lisa";

const options = {
    avatar,
    currentUserFirstName: "Анна",
    currentUserLastName:  "Гурова",
    isUser: true,
};

@hot(module)
export default class App extends Component {
    render () {
      const isUser = false;

        return isUser ? (
              <Catcher>
                  <Provider value = { options }>
                    <StatusBar />
                         <Switch>
                           <Route component = {Feed} path='/feed' />
                           <Route component = {Profile} path='/profile' />
                           <Route component = {Login} path='/login' />
                           <Redirect to = '/feed'/>
                         </Switch>
                  </Provider>
              </Catcher>
          ) : (
            <Catcher>
                  <Provider value = { options }>
                    <StatusBar />
                         <Route component = {Login} path='/login' />
                         <Redirect to = '/login'/>
                    </Provider>
              </Catcher>
          )

    }
}
