import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../../UI/Button/Button';
import axios from '../../../../axios-orders';
import classes from './ContactData.less';
import Spinner from '../../../UI/Spinner/Spinner';
import Input from '../../../UI/Input/Input';
import { purchaseBurger } from '../../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

class ContactData extends Component {
    state = {
        orderForm: {
            // You can create a method to return this object
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                label: 'Name',
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' },
                    ]
                },
                value: 'fastest',
                valid: true
            }
        },
        formIsValid: false
    };

    checkValidity = (value, rules={}) => {
        let isValid = true;

        if (rules.required) {
            isValid &= value.trim() !== '';
        }

        if (rules.minLength) {
            isValid &= value.length >= rules.minLength;
        }

        if (rules.maxLength) {
            isValid &= value.length <= rules.maxLength;
        }

        if (rules.isEmail) {
            const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            isValid &= pattern.test(value);
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid &= pattern.test(value);
        }

        return isValid;
    };

    orderHandler = (event) => {
        // preventDefault because I don't want to send the request automatically,
        // It will reload the page.
        event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price, //this should be calculated on the server in prod
            orderData: formData,
            userId: this.props.userId
        };

        this.props.orderBurger(order, this.props.token);
    };

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier],
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputID in updatedOrderForm) {
            formIsValid &= updatedOrderForm[inputID].valid
        }

        this.setState({
            orderForm: updatedOrderForm,
            formIsValid
        })
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        label={formElement.config.label}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => {
                            this.inputChangedHandler(event, formElement.id)
                        }}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );

        if (this.props.loading) {
            form = <Spinner/>
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        orderBurger: (orderData, token) => dispatch(purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
