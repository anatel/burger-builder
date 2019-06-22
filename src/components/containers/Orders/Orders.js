import React, { Component, Fragment } from 'react';
import Order from '../../Order/Order';
import axios from '../../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../UI/Spinner/Spinner';
import { connect } from 'react-redux';
import { fetchOrders } from '../../../store/actions';

class Orders extends Component {
    componentDidMount() {
        this.props.fetchOrders();
    }

    render() {
        return (
            <Fragment>
                {!this.props.loading && this.props.orders.length === 0 && 'No orders to display'}
                {!this.props.loading && this.props.orders.map(order => (
                    <Order key={order.id}
                           ingredients={order.ingredients}
                           price={order.price}/>
                ))}
                {this.props.loading && <Spinner />}
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading
    }
};


export default connect(mapStateToProps, {
    fetchOrders
})(withErrorHandler(Orders, axios));
