import React, {
	useState,
	useEffect,
	useReducer,
	useContext,
	useRef,
} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

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
	const emailRef = useRef();
	const passwordRef = useRef();
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
		if (formIsValid) {
			authCtx.onLogin(emailState.value, passwordState.value);
		} else if (!emailIsValid) {
			emailRef.current.focus();
		} else {
			passwordRef.current.focus();
		}
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<Input
					ref={emailRef}
					id="email"
					label="E-Mail"
					type="email"
					isValid={emailIsValid}
					value={emailState.value}
					onChange={emailChangeHandler}
					onBlur={validateEmailHandler}
				/>
				<Input
					ref={passwordRef}
					id="password"
					label="Password"
					type="password"
					isValid={emailIsValid}
					value={passwordState.value}
					onChange={passwordChangeHandler}
					onBlur={validatePasswordHandler}
				/>

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
