import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Layout from './components/hoc/Layout/Layout';
import BurgerBuilder from './components/containers/BurgerBuilder/BurgerBuilder';
import Checkout from './components/containers/Checkout/Checkout';
import Orders from './components/containers/Orders/Orders';
import Auth from './components/containers/Auth/Auth';
import Logout from './components/containers/Auth/Logout/Logout';
import { authCheckState } from './store/actions';

class App extends Component {

    componentDidMount() {
        this.props.onTryAutoSignIn();
    };

    render() {
        const { isAuthenticated } = this.props;

        let routes = (
            <Switch>
                <Route path="/" exact component={BurgerBuilder} />
                <Route path="/auth" component={Auth} />
                <Redirect to="/" />
            </Switch>
        );

        if (isAuthenticated) {
            routes = (
                <Switch>
                    <Route path="/" exact component={BurgerBuilder} />
                    <Route path="/checkout" component={Checkout} />
                    <Route path="/orders" component={Orders} />
                    <Route path="/auth" component={Auth} />
                    <Route path="/logout" component={Logout} />
                    <Redirect to="/" />
                </Switch>
            )
        }

        return (
            <Layout>
                {routes}
            </Layout>

        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.auth.token
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignIn: () => dispatch(authCheckState())
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
