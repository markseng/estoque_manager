import React, { useState, useRef } from 'react';
import { Grid } from '@material-ui/core';
import { SelectText, StandartInput } from './Inpusts'

const CreateInput = ({ Inputs, handleOnChangeInputs, listTypes }) => {


    return (
        <>
            {
                Inputs.map((newInput, i) => (
                    <Grid style={{ marginTop: "20px" }} container spacing={2} key={i}>
                        <Grid item xs={3}>
                            <StandartInput
                                label="Descrição"
                             
                                
                                onChange={(ev) => handleOnChangeInputs(ev, i, "")}
                                value={newInput.name}
                                name={'name'}

                            />
                        </Grid>
                        <Grid item xs={3}>
                            <StandartInput
                                label="Label"
                   
                                
                                onChange={(ev) => handleOnChangeInputs(ev, i, "")}
                                value={newInput.label}
                                name={'label'}

                            />
                        </Grid>
                        <Grid item xs={3}>
                            <SelectText
                                label="Tipo"
                                listItens={listTypes}
                                onChange={(ev) => handleOnChangeInputs(ev, i, "")}
                                value={newInput.type}
                                name={'type'}

                            />
                        </Grid>
                        <Grid item xs={3}>
                            <StandartInput
                                label="Valor por default"
                                
                                
                                onChange={(ev) => handleOnChangeInputs(ev, i, "")}
                                value={newInput.value}
                                name={'value'}

                            />
                        </Grid>

                    </Grid>




                ))
            }
        </>

    )
}

export default CreateInput