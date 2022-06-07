
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@material-ui/core';

const DialogRegister = ({open, onClose, body,onDone, onCancel }) => {

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {body}
                    </DialogContentText>
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