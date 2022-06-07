import React, { useState, useRef, } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { SelectText, StandartInput } from './Inpusts'


interface variables {
    value: string, label: string, typeInput: string
}

interface props {
    value: string,
    onChange: Function
}

const itemSelect = [
    { value: 'qrcode', label: 'Leitura de Qr Code' },
    { value: 'list', label: 'Selecionar em uma lista' }
]

const TypeInput = (props: props) => {
    const { value, onChange } = props



    return (
        <>
            <Grid container spacing={2} >
                <Grid item xs={6}>
                    <p>
                        {`Como será input para o requisitante:`}
                    </p>


                </Grid>
                <Grid item xs={6}>
                    <SelectText
                        listItens={itemSelect}
                        value={value}
                        onChange={(ev) => onChange(ev.target.value)}
                        label="Selecione a variável"
                        name='variable'
                    />


                </Grid>
            </Grid>

        </>

    )

}

export default TypeInput