import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import { Grid, Button, Card, CardContent, MenuItem, Select, Input } from '@material-ui/core';

import '../assets/css/index.css';
import Alert from './Alert.jsx';
import { RegisterUser } from '../redux/actions/Auth';
import { ShowPage } from '../redux/actions/Page';
import {CSSRegister} from './styles/CSSRegister';

const Register = ({serverError, secretQuestions, RegisterUser, ShowPage}) => {
    const classes = CSSRegister();
    const [formData, setState] = useState({designation:'Assistant Manager', email:'', password:'', key:'', secretQst:{}});
    const {designation, email, password, key} = formData;
    const [error, setError] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    
    const onChange = (evt) => {
        setError('');
        setState({...formData, [evt.currentTarget.name]:evt.currentTarget.value});
    }

    const capitalize = (str) => {
        let arr = str.split(' ');
        return arr.reduce((str1,str2)=>
            str1.charAt(0).toUpperCase()+str1.slice(1)+" "+str2.charAt(0).toUpperCase()+str2.slice(1));
    }
    
    const submitHandler = () => {
        let err = ''
        if(designation.length <= 3){
            err = 'please enter your designation';
        }else if(email.search('@') == -1 || email.length <= 4 || email.search('.') == -1){
            err = 'please enter valid email address';
        }else if(password.length<6){
            err = 'please enter valid password';
        }else if(question.length<=2 || answer.length<=2){
            err = 'please select secret question and answer';
        }
        
        err.length <= 0 ? RegisterUser({name:capitalize(email.split("@")[0].split('.').join(' ')), email, password, key, designation, secretQst:{ qst:question, answer:answer }}) : setError(err);
    }

    return (
        <Grid container className={classes.root} direction="column" justify="center" alignItems="center">
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <div>
                        <label className={classes.label}>Designation:</label>
                        <input className={classes.input} name='designation' disabled value={designation} type="text" onChange={onChange} 
                            placeholder="please enter your designation" />
                    </div>

                    <div>
                        <label className={classes.label}>Email:</label>
                        <input className={classes.input} type="text" name='email' value={email} onChange={onChange} 
                            placeholder="please enter valid email id" />
                    </div>

                    <div>
                        <label className={classes.label}>Password:</label>
                        <input className={classes.input} type="password" name='password' value={password} onChange={onChange} 
                            placeholder="please enter your password" />
                        <label className={classes.placeholder}>password should contain letters and numbers with min length 6</label>
                    </div>

                    <div>
                        <label className={classes.label}>Secret key:</label>
                        <input className={classes.input} type="text" name='key' value={key} onChange={onChange}
                            placeholder="please enter secret key" />
                    </div>

                    <div style={{paddingTop:20}}>
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

                        <Input style={{marginLeft:20}} value={answer} onChange={evt=>setAnswer(evt.target.value)} placeholder='your answer here' />
                    </div>

                    <div className={classes.btnHolder}>
                        <Button className={classes.btn} variant="contained" color="primary"
                                onClick={submitHandler} >Register</Button>

                        <div style={{paddingTop:20, marginLeft:10}}>
                            Already have account
                            <Button color="primary" onClick={()=>ShowPage('Login')} >Login</Button>
                        </div>
                    </div>
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
        secretQuestions:state.default.secretQuestions
    }
}

Register.propTypes = {
    serverError:PropTypes.string,
    RegisterUser:PropTypes.func.isRequired,
    ShowPage:PropTypes.func.isRequired
}

export default connect(stateToProps, { RegisterUser, ShowPage }) (Register);
