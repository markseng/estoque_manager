import React, { useState, useRef, } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { SelectText, StandartInput } from './Inpusts'
interface list {
    collumn: string
    variable: string,
    typeInput: string
}
interface variable {
    value: string,
    label: string
}


interface props {
    listKeys: list[],
    onChange: Function,
    listVariable: variable[]
}

const DefineVariablePlan = (props: props) => {
    const { listKeys, onChange, listVariable } = props
    // const variable = [
    //     { value: 'Equipamento', label: "Equipamento" },
    //     { value: 'produto', label: "produto" },
    //     { value: 'recurso', label: "recurso" },
    //     { value: 'posto_trabalho', label: "Posto de Trabalho" },
    //     { value: 'colaborador', label: "Colaborador" },
    //     { value: 'id_produto', label: "Código do  Produto" },
    //     { value: 'grupo_produto', label: "Grupo do produto" },

    // ]


    return (
        <>
            {listKeys.map((value, i) =>
                <>
                    <Grid container spacing={2} key={i}>
                        <Grid item xs={6}>
                     <p>
                     {`Qual varável representa a coluna: ${value.collumn}`} 
                     </p>
                               
                          
                        </Grid>
                        <Grid item xs={6}>
                            <SelectText
                                listItens={listVariable}
                                value={value.variable}
                                onChange={(ev) => onChange(ev, i)}
                                label="Selecione a variável"
                                name='variable'
                            />


                        </Grid>
                    </Grid>
                </>
            )}
        </>

    )

}

export default DefineVariablePlan