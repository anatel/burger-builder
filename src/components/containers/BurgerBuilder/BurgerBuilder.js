import React, { Component, Fragment } from 'react';
import Burger from '../../../components/Burger/Burger';
import BuildControls from '../../Burger/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import OrderSummary from '../../Burger/OrderSummary/OrderSummary';
import Spinner from '../../UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 4, // the base price
    purchasable: false,
    purchasing: false,
    loading: false,
    error: null
  }

  componentDidMount() {
    axios.get('/ingredients.json')
        .then(response => {
          this.setState({
            ingredients: response.data
          })
        })
        .catch(error => {
          this.setState({ error: true })
        })
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
        .map(igKey => {
          return ingredients[igKey];
        })
        .reduce((total, currAmount) => {
          return total + currAmount;
        }, 0)
    this.setState({
      purchasable: sum > 0
    })
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = { ...this.state.ingredients, [type]: updatedCount }
    const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    if (this.state.ingredients[type] !== 0) {
      const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
      const updatedIngredients = {
        ...this.state.ingredients,
        [type]: this.state.ingredients[type] - 1
      }
      this.setState({
        totalPrice: newPrice,
        ingredients: updatedIngredients
      })
      this.updatePurchaseState(updatedIngredients);
    }
  }

  purchaseHandler = () => {
    this.setState({
      purchasing: true
    })
  }

  purchaseCancelHandler = () => {
    this.setState({
      purchasing: false
    })
  }

  purchaseContinueHandler = () => {
    this.setState({ loading: true });
    //Dummy data
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice, //this should be calculated on the server in prod
      customer: {
        name: 'Anat Eliyahu',
        address: {
          street: 'Teststreet 1',
          zipCode: '12345',
          country: 'Israel'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    };

    axios.post('/orders.json', order)
        .then(response => {
          this.setState({ loading: false, purchasing: false });
        })
        .catch(error => {
          this.setState({ loading: false, purchasing: false });
        });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] === 0;
    }

    let orderSummary = null;

    let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
    if (this.state.ingredients) {
      burger = (
          <Fragment>
            <Burger ingredients={this.state.ingredients}/>
            <BuildControls ingredientAdded={this.addIngredientHandler}
                           ingredientRemoved={this.removeIngredientHandler}
                           disabled={disabledInfo}
                           purchasable={this.state.purchasable}
                           ordered={this.purchaseHandler}
                           price={this.state.totalPrice}/>
          </Fragment>
      );
      orderSummary = <OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}/>;
    }

    if (this.state.loading) {
      orderSummary = <Spinner/>;
    }

    return (
        <Fragment>
          <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            {orderSummary}
          </Modal>
          {burger}
        </Fragment>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
