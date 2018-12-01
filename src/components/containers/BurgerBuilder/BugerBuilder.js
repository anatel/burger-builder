import React, {Component, Fragment} from 'react';
import Burger from "../../../components/Burger/Burger";
import BuildControls from "../../Burger/BuildControls/BuildControls";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}
class BurgerBuilder extends Component {

  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4 // the base price
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {...this.state.ingredients, [type]: updatedCount}
    const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    })
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
    }
  }

  render() {
    const disabledInfo = {
        ...this.state.ingredients
    }

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] === 0;
    }

    return (
        <Fragment>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls ingredientAdded={this.addIngredientHandler}
                         ingredientRemoved={this.removeIngredientHandler}
                         disabled={disabledInfo}
                         price={this.state.totalPrice}/>
        </Fragment>
    );
  }
}

export default BurgerBuilder;
