import React, { Component } from 'react';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import classes from './Auth.less';
import * as actions from '../../../store/actions';
import { connect } from 'react-redux';
import Spinner from '../../UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';

class Auth extends Component {

    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6 // the minimum required in firebase
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: true
    };

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.auth.redirectPath !== '/') {
            this.props.resetRedirectPath();
        }
    };

    checkValidity = (value, rules = {}) => {
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

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                touched: true,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation)
            }
        };

        this.setState({
            controls: updatedControls
        })
    };

    submitHandler = (event) => {
        event.preventDefault(); //prevent page reload
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    };

    switchAuthModeHandler = () => {
        this.setState((prevState => ({
            isSignUp: !prevState.isSignUp
        })));
    };

    render() {

        if (this.props.isAuthenticated) {
            return <Redirect to={this.props.auth.redirectPath} />;
        }

        const formElementArray = [];
        for (let key in this.state.controls) {
            formElementArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }

        let form = formElementArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
        ));

        if (this.props.auth.loading) {
            form = <Spinner />
        }

        let errorMessage = this.props.auth.error ? (
            <p>{this.props.auth.error.message}</p>
        ) : null;

        return (
            <div className={classes.Auth}>
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button
                    btnType="Danger"
                    clicked={this.switchAuthModeHandler}
                >
                    SWITCH TO {this.state.isSignUp ? 'SIGN IN' : 'SIGN UP'}
                </Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
      auth: state.auth,
      isAuthenticated: !!state.auth.token,
      buildingBurger: state.burgerBuilder.building
  }
};
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        resetRedirectPath: () => dispatch(actions.setRedirectPath('/'))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
