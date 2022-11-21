import React, {useState, useEffect, useReducer, useContext} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
	if (action.type === 'USER_INPUT') {
		return {value: action.val, isValid: action.val.includes('@')};
	} else if (action.type === 'USER_BLUR') {
		return {value: action.val, isValid: state.value.includes('@')};
	}
	return {value: '', isValid: false};
};

const passwordReducer = (state, action) => {
	if (action.type === 'USER_INPUT') {
		return {value: action.val, isValid: state.value.trim().length > 6};
	} else if (action.type === 'USER_BLUR') {
		return {value: action.val, isValid: state.value.trim().length > 6};
	}
	return {value: '', isValid: false};
};

const Login = () => {
	// const [enteredEmail, setEnteredEmail] = useState('');
	// const [emailIsValid, setEmailIsValid] = useState();
	// const [passwordState.value, setEnteredPassword] = useState('');
	// const [passwordState.isValid, setPasswordIsValid] = useState();
	const authCtx = useContext(AuthContext);
	const [formIsValid, setFormIsValid] = useState(false);

	const [emailState, dispatchEmail] = useReducer(emailReducer, {
		value: '',
		isValid: false,
	});

	const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
		value: '',
		isValid: false,
	});

	const {isValid: emailIsValid} = emailState;
	const {isValid: passwordIsValid} = passwordState;

	useEffect(() => {
		const handler = setTimeout(() => {
			setFormIsValid(emailIsValid && passwordIsValid);
		}, 500);

		return () => {
			clearTimeout(handler);
		};
	}, [emailIsValid, passwordIsValid]);

	const emailChangeHandler = (event) => {
		dispatchEmail({type: 'USER_INPUT', val: event.target.value});
	};

	const passwordChangeHandler = (event) => {
		dispatchPassword({type: 'USER_INPUT', val: event.target.value});
	};

	const validateEmailHandler = () => {
		dispatchEmail({type: 'USER_BLUR'});
	};

	const validatePasswordHandler = () => {
		dispatchPassword({type: 'USER_BLUR'});
	};

	const submitHandler = (event) => {
		event.preventDefault();
		authCtx.onLogin(emailState.value, passwordState.value);
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<div
					className={`${classes.control} ${
						emailState.isValid === false ? classes.invalid : ''
					}`}>
					<label htmlFor="email">E-Mail</label>
					<input
						type="email"
						id="email"
						value={emailState.value}
						onChange={emailChangeHandler}
						onBlur={validateEmailHandler}
					/>
				</div>
				<div
					className={`${classes.control} ${
						passwordState.isValid === false ? classes.invalid : ''
					}`}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={passwordState.value}
						onChange={passwordChangeHandler}
						onBlur={validatePasswordHandler}
					/>
				</div>
				<div className={classes.actions}>
					<Button type="submit" className={classes.btn} disabled={!formIsValid}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
