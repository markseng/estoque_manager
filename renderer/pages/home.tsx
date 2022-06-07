import React, { useState, useRef, useEffect } from 'react';
import {
    Button, Grid, Typography,
    Step, StepLabel, Stepper, Snackbar
} from '@material-ui/core';
import { ipcRenderer } from 'electron'
import router, { useRouter } from 'next/router'
import useStyles from '../lib/styles'
import { SelectText, StandartInput } from '../components/Inpusts'
import { useAuth } from '../components/context/Auth'


const SingIn = () => {

    useEffect(()=>{



        if(!ipcRenderer.sendSync('CeckProd')){
            router.push('/Menu')
        }
    }, [])
    const route = useRouter()
const {signed, handleSingIn }  = useAuth()

    const classes = useStyles()
    const [user, SetUser] = useState({
        email: "",  
        password: ""
    })

    const onChange = ({ target }) => {
        const { name, value } = target

        let newUser = user
        newUser[name] = value
        SetUser({ ...newUser })

    }
    const onSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
       
    const succSingIn = handleSingIn(user)
    console.log(succSingIn)
        if( succSingIn){
            router.push('/Menu')
        }

    }

    return (
        <div className={classes.root} style={{ padding: '50px' }} >
            <form onSubmit={onSubmit}>
                <Grid style={{ padding: '50px' }} container direction='column' justify='center' alignItems='center' spacing={2} >
                    <Grid item xs={12}>
                        <img style={{ width: "200px" }} src="/images/resute2.png" />


                    </Grid>
                    <Grid item xs={12}>
                        <StandartInput
                        type='emailf'
                            label='Usuário'
                            name='email'
                            onChange={onChange}
                            value={user.email}
                        />

                    </Grid>

                    <Grid item xs={12}>
                        <StandartInput
                            label='Senha'
                            name='password'
                            onChange={onChange}
                            value={user.password}
                            type='password'
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <Button type='submit' className={classes.buutonStyle} style={{ width: '200px' }}>
                            Login 
                        </Button>

                    </Grid>

                </Grid>


            </form>


        </div>
    )
}

export default SingIn