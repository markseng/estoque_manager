import React, { useEffect, useRef, useState } from 'react';
import {
    Button, Grid,

} from '@material-ui/core';
import DialogRegister from '../components/DialogNexSte'
import useStyles from '../lib/styles'
import { ipcRenderer } from 'electron';
import { useRouter } from 'next/router'
import { useAuth } from '../components/context/Auth'
import TableConsume from '../components/tables/TableConsum'
import {SelectText} from '../components/Inpusts'

const ViewTable: React.FC = () => {
    const { user } = useAuth()
    const router = useRouter()
    const [dataConsume, setdataConsume] = useState([])
    const [dataFeed, setdataFeed] = useState([])
    const [tableSelect, setTableSlect] = useState<'comsume' | 'feed'>('comsume')
    const [openDialog, setOpenDialog] = useState(false)
    const idSlects = useRef({
        idFirestone: "",
        idFrontEnd: 0,
    })
    useEffect(() => {
        const index = user.indexOf('@')
        const index2 = user.indexOf('.com')
        const company = user.slice(index + 1, index2)
        const response = ipcRenderer.sendSync('getCloudData', company)
        console.log(response)
        if (response.succ) {
            const [dataConsume, dataFeed] = response.data
            setdataConsume([...dataConsume])
            setdataFeed([...dataFeed])
        }

    }, [])
    const colluns = ['CODIGO', 'DECRIÇÃO', 'REQUISITANTE', 'QTD', 'UNIDADE_DE_MEDIDA', 'Data', 'Hora', 'Excluir']
    const collunsFeed = ['CODIGO', 'DECRIÇÃO', 'ALMOXARIFE', 'QTD', 'UNIDADE_DE_MEDIDA', 'FORNECEDOR', 'Data', 'Hora', 'Excluir']
    const collunsConsumeOBJT = ['CODIGO', 'DESCRICAO', 'REQUISITANTE', 'QUANTIDADE', 'UNIDADE_DE_MEDIDA', 'date', 'hora']
    const collunsFeedOBJT = ['CODIGO', 'DESCRICAO', 'ALMOXARIFE', 'QUANTIDADE', 'UNIDADE_DE_MEDIDA', 'FORNECEDOR', 'date', 'hora']
    const classes = useStyles();
    const handleDelete = (idFirestone: string, idFrontEnd: number) => {
        setOpenDialog(true)
        idSlects.current = {
            idFirestone,
            idFrontEnd
        }

    }

    const DeleteRow = () => {
        const index = user.indexOf('@')
        const index2 = user.indexOf('.com')
        const company = user.slice(index + 1, index2)

        const { idFirestone, idFrontEnd } = idSlects.current

        const succDelete: boolean = ipcRenderer.sendSync('deleteFireStone', idFirestone, company, tableSelect)
        if (succDelete) {
            let newValue = tableSelect === 'comsume' ? dataConsume : dataFeed
            if (newValue.length > 0) {
                newValue.splice(idFrontEnd, 1)
                setdataConsume([...newValue])
            }
        }
        setOpenDialog(false)
    }
    const onChange = ({target})=>{
        const {value} =target
        console.log(value)
        setTableSlect(value)

    }

    const ExportXlsx = () => {
        const dataExport = tableSelect === 'comsume' ? dataConsume : dataFeed
        const succ = ipcRenderer.sendSync('exportXlsx', dataExport)
        
    }

    return (
        <div className={classes.root} >
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Button

                        onClick={() => router.push('/CreateQrCode')}
                        className={classes.buutonStyle}>
                        Voltar
                    </Button>

                </Grid>
                <Grid item xs={4}>
                  <SelectText  
                  listItens={[{label: 'Tabela de consumo', value: 'comsume'}, {label: 'Tabela de alimentação', value: 'feed'}]}
                  onChange={onChange}
                  value={tableSelect}
                  label='Selecione a tabela'
                  name='selectTable'
                  />

                </Grid>
                <Grid item xs={4}>
                    <Button

                        onClick={() => ExportXlsx()}
                        className={classes.buutonStyle}>
                        Export Excel
                    </Button>

                </Grid>
                {
                    tableSelect === 'comsume' ?
                        <TableConsume
                            dataTable={dataConsume}
                            colluns={colluns}
                            handleDelete={handleDelete}
                            collunsOBJ={collunsConsumeOBJT}
                        /> :
                        <TableConsume
                            dataTable={dataFeed}
                            colluns={collunsFeed}
                            handleDelete={handleDelete}
                            collunsOBJ={collunsFeedOBJT}
                        />

                }



            </Grid>
            <DialogRegister
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                body="Deseja excluir este apontamento?"
                onDone={() => DeleteRow()}
                onCancel={() => setOpenDialog(false)}
            />
        </div >
    )
}

export default ViewTable;