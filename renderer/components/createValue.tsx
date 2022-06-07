import React, { useState, useRef,  } from 'react';
import { Grid } from '@material-ui/core';
import { SelectText, StandartInput } from './Inpusts'

const CreateValuesInputs = ({ createValues, handleOnChangeInputs, listTypesCreate }) => {


    return (
        <>
          {
            createValues.map((newInput, i) => (
              <Grid style={{ marginTop: "20px" }} container spacing={2} key={i}>
                <Grid item xs={6}>
                  <StandartInput
                    label="Descrição"
                  
          
                    onChange={(ev) => handleOnChangeInputs(ev, i, 'create')}
                    value={newInput.name}
                    name={'name'}

                  />
                </Grid>

                <Grid item xs={6}>
                  <SelectText
                    label="Tipo"
                    listItens={listTypesCreate}
                    onChange={(ev) => handleOnChangeInputs(ev, i, 'create')}
                    value={newInput.type}
                    name={'type'}

                  />
                </Grid>

              </Grid>




            ))
          }
        </>

    )
}

export default CreateValuesInputs