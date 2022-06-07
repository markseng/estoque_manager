import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

interface listSlect{
    label: string, value: string
}

interface props {
    label: string,
    value?: string | number | null,
    onChange: Function,
    type?: string
    name: string

}

interface select {
    label: string,
    value?: string,
    onChange: any,
    listItens: listSlect[]
    name: string

}


export const StandartInput = (props: props) => {

    const { label,
        value,
        onChange,
        type,
        name } = props
    return (
        <TextField

            value={value}
            label={label}
            onChange={(ev) => onChange(ev)}
            fullWidth
            variant='outlined'

            type={type}
            name={name}
            required={name === "value" ? false : true}

        />
    )

}
export const SelectText = (props: select) => {
const {onChange, value, listItens, label, name} = props
    return (
        <FormControl variant="filled" fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                onChange={onChange}
                fullWidth
                variant='outlined'
                name={name}
                required
            >
                {
                    listItens.map((item, i) => (

                        <MenuItem key={i} value={item.value} >{item.label}</MenuItem>

                    ))
                }

            </Select>
        </FormControl>

    )

}