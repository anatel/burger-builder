import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Layout from './components/hoc/Layout/Layout';
import BurgerBuilder from './components/containers/BurgerBuilder/BurgerBuilder';
import Logout from './components/containers/Auth/Logout/Logout';
import { authCheckState } from './store/actions';

const Checkout = React.lazy(() => import('./components/containers/Checkout/Checkout'));
const Orders = React.lazy(() => import('./components/containers/Orders/Orders'));
const Auth = React.lazy(() => import('./components/containers/Auth/Auth'));

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
            <Suspense fallback={<div>Loading...</div>}>
                <Layout>
                    {routes}
                </Layout>
            </Suspense>

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
