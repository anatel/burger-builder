import React, { Component, Fragment } from 'react';
import Order from '../../Order/Order';
import axios from '../../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../UI/Spinner/Spinner';

class Orders extends Component {

    state = {
        orders: [],
        loading: true,
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(res => {
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({ id: key, ...res.data[key] });
                }
                this.setState({
                    loading: false,
                    orders: fetchedOrders
                })
            })
            .catch(err => {
                this.setState({ loading: false })
            })
    }

    render() {
        return (
            <Fragment>
                {!this.state.loading && this.state.orders.map(order => (
                    <Order key={order.id}
                           ingredients={order.ingredients}
                           price={order.price}/>
                ))}
                {this.state.loading && <Spinner />}
            </Fragment>
        )
    }
}

export default withErrorHandler(Orders, axios);
