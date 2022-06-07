import React from 'react';
import { SelectText, StandartInput } from './Inpusts'
// import { Container } from './styles';
interface props {
    onChange: Function,
    value: string
}

const SelectFunction = (props: props) => {
    const { onChange , value} = props

    return <SelectText
        label='Selecionar a função'
        onChange={onChange}
        // value={value}
        listItens={[{
            label: "Consumir", value: 'consume'
        },
        { label: 'Alimentar', value: 'ToFeed' }

        ]}
        name='SelectFunction'


    />
}

export default SelectFunction;