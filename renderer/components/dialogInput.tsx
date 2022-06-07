
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, } from '@material-ui/core';
import { SelectText, StandartInput } from './Inpusts'


const DialogRegister = ({ open, onClose, onDone, onCancel, valuesSelect, onChange }) => {
    const {
        data,
        index,
        listCollunm,
        valueColumnSelect

    } = valuesSelect

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
               
            >

                <DialogContent>
                    <div
                     style={{width: '400px', height:'50px'}}
                    >
                    <SelectText
                      onChange={onChange}
                      label='Selecione a coluna que contém os valores'
                      name='selectValueColumn'
                      listItens={listCollunm}
                      value={valueColumnSelect}
                      />

                    </div>
                    {/* <DialogContentText id="alert-dialog-description"> */}
                     
                    {/* </DialogContentText > */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDone} color="primary">
                        Sim
          </Button>
                    <Button onClick={onCancel} color="primary" autoFocus>
                        Não
          </Button>
                </DialogActions>
            </Dialog>
        </>
    );

}

export default DialogRegister