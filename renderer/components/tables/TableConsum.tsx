import React, { useEffect, useRef, useState } from 'react';
import {
    Button, Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';

import useStyles from '../../lib/styles'


const TableConsume = ({
    colluns,
    dataTable,
    handleDelete,
    collunsOBJ

}) => {

const classes = useStyles()

    return (
<>
<Grid container spacing={2}>



            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table size="small"
                        aria-label="a dense table">
                        <TableHead>
                            <TableRow>

                                {
                                    colluns.map((item, i) => (
                                        <TableCell
                                            key={`${i}c`}
                                            align="center">
                                            {item}
                                        </TableCell>
                                    )
                                    )

                                }




                            </TableRow>

                        </TableHead>
                        <TableBody>

                            {
                                dataTable.map((item, i) => (
                                    <TableRow key={`${i}r`}>
                                        {collunsOBJ.map((key, i)=>(
                                             <TableCell
                                                key={`obj${i}`}
                                             align="center">
                                             {item[key]}
                                         </TableCell>

                                        ))}

                                       
                                        <TableCell

                                            align="center">
                                            <Button onClick={() => handleDelete(item.idFireStone, i)}>
                                                Exluir
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                )
                                )

                            }


                        </TableBody>

                    </Table>
                </TableContainer>


            </Grid>

        </Grid>
</>



    )
}

export default TableConsume;