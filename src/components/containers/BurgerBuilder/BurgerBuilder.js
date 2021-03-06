import React, { Component } from 'react';
import Burger from '../../../components/Burger/Burger';
import BuildControls from '../../Burger/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import OrderSummary from '../../Burger/OrderSummary/OrderSummary';
import Spinner from '../../UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../../store/actions';
import { connect } from 'react-redux';
import { purchaseInit } from '../../../store/actions';

class BurgerBuilder extends Component {

    state = {
        purchasing: false
    };

    componentDidMount() {
        this.props.initIngredients();
    }

    getPurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((total, currAmount) => {
                return total + currAmount;
            }, 0);

        return sum > 0;
    };

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({
                purchasing: true
            })
        } else {
            this.props.setRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    };

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        })
    };

    purchaseContinueHandler = () => {
        this.props.purchaseInit();
        this.props.history.push('/checkout');
    };

    render() {
        const {
            ings,
            totalPrice,
            onIngredientAdded,
            onIngredientRemoved
        } = this.props;

        const disabledInfo = {
            ...ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] === 0;
        }

        let orderSummary = null;

        let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
        if (ings) {
            burger = (
                <>
                    <Burger ingredients={ings} />
                    <BuildControls ingredientAdded={onIngredientAdded}
                                   ingredientRemoved={onIngredientRemoved}
                                   disabled={disabledInfo}
                                   purchasable={this.getPurchaseState(ings)}
                                   ordered={this.purchaseHandler}
                                   price={totalPrice}
                                   isAuth={this.props.isAuthenticated} />
                </>
            );
            orderSummary = <OrderSummary
                ingredients={ings}
                price={totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }

        return (
            <>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </>
        );
    }
}


const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: !!state.auth.token
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(burgerBuilderActions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(burgerBuilderActions.removeIngredient(ingredientName)),
        initIngredients: () => dispatch(burgerBuilderActions.initIngredients()),
        purchaseInit: () => dispatch(purchaseInit()),
        setRedirectPath: (path) => dispatch(burgerBuilderActions.setRedirectPath(path))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
