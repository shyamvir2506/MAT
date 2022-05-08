import React,{useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Button, Card, CardContent, Select, MenuItem, Input, IconButton, InputAdornment } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FPassword } from '../redux/actions/Auth';
import Alert from './Alert.jsx';
import { ShowPage } from '../redux/actions/Page';
import { CSSForgetPassword } from './styles/CSSForgetPassword';

const ForgetPassword = ({secretQuestions, passwordReset, serverError, FPassword, ShowPage})=> {
    const classes = CSSForgetPassword();
    const [error, setError] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [password, setPassword] = useState({value:'', show:false});
    const [email, setEmail] = useState('');

    const submitHandler = () => {
        let err = ''
        if(email.search('@') == -1 || email.length <= 4 || email.search('.') == -1){
            err = 'please enter valid email address'
        }else if(password.length<6){
            err = 'please enter valid password';
        }else if(answer.length<=2 || question.length<=2){
            err = 'please select question and answer';
        }

        err.length<=0 ? FPassword({email, password, secretQst:{qst:question, answer:answer}}) : setError(err);
    }

    return (
        <Grid container className={classes.root} direction="column" justify="center" alignItems="center">
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    {
                        passwordReset ?
                        <Grid container alignItems='center' justify='center' direction="column" style={{marginTop:75}}>
                            <h4>Password Reset Successfull.</h4>
                            <div style={{marginTop:10}}>
                                please <Button onClick={()=>ShowPage('Login')} variant="contained" color="primary">Login</Button> to continue.
                            </div>
                        </Grid> :
                        <>
                            <div>
                                <label className={classes.label}>Email Address:</label>
                                <input className={classes.input} name="email" value={email} type="text" onChange={(evt)=>setEmail(evt.target.value)} 
                                    placeholder="please enter valid email" />
                            </div>

                            <div style={{paddingTop:40}}>
                                <Select style={{width:200}} className={classes.select} value={question} displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }} onChange={(evt)=>setQuestion(evt.target.value)} input={<Input />}>
                                    <MenuItem value=""> <em>Select a question</em> </MenuItem>
                                    {
                                        secretQuestions.map((obj) => {
                                            return (
                                                <MenuItem key={obj} value={obj}>{ obj }</MenuItem>
                                            )
                                        })
                                    }
                                </Select>

                                <Input style={{marginLeft:20}} value={answer} placeholder='your answer here' onChange={(evt)=>setAnswer(evt.target.value)}/>
                            </div>

                            <div style={{paddingTop:40}}>
                                <Input style={{width:'100%'}} type={password.show ? 'text' : 'password'} value={password.value} onChange={(evt) => setPassword({...password, value:evt.target.value})} 
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton aria-label="toggle password visibility" onClick={()=>setPassword({...password, show:!password.show})} onMouseDown={(evt)=>evt.preventDefault()} >
                                                {password.show ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment> 
                                    } 
                                />
                            </div>

                            <div className={classes.btnHolder}>
                                <Button className={classes.btn} variant="contained" color='primary' onClick={submitHandler} >Reset</Button>
                            </div>
                        </>
                    }
                </CardContent>
            </Card>

            {
                (error.length>=5 || serverError.length >= 5) && 
                <Alert className={classes.alert} severity="error">{(error.length>=4 && error) || serverError}</Alert>
            }
        </Grid>
    )
}

const stateToProps = state => {
    return {
        serverError:state.auth.serverError,
        secretQuestions:state.default.secretQuestions,
        passwordReset:state.auth.passwordReset
    }
}

ForgetPassword.propTypes = {
    serverError:PropTypes.string,
    secretQuestions:PropTypes.array,
    FPassword:PropTypes.func,
    ShowPage:PropTypes.func
}

export default connect(stateToProps, {FPassword,ShowPage}) (ForgetPassword);