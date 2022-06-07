
import React, { useState, useRef, useEffect } from 'react';
import {
    Button, Grid, Typography,
    Step, StepLabel, Stepper, Snackbar
} from '@material-ui/core';
import { ipcRenderer } from 'electron'
import { SelectText, StandartInput } from '../components/Inpusts'
import DefineVariablePlan from '../components/defineVariable'
import TypeInput from '../components/InputMobile'
import { SimpleDialog } from '../components/dialog'
import DialogRegister from '../components/dialogInput'
import SelectFunction from '../components/selectFunction'
import { useRouter } from 'next/router'
import CircularProgressWithLabel from '../components/pogreesWithLabel'
// import * as resute2 from '../public/images/'

// import { SiGooglesheets, SiMicrosoftexcel } from "react-icons/si";
// import { AiFillFolderOpen } from "react-icons/ai";

import useStyles from '../lib/styles'



function getSteps() {
    return ['Selecionar Planilha de Excel', 'Definir inputs dos APP mobile'];
}
interface variable {
    value?: string,
    label?: string
}

interface  objectDataQRCode {
    CODIGO: string,
    DESCRICAO: string
}
interface dataPlanType {
    DataQRCode: [objectDataQRCode?],
    Dados_Stock: [],
    Requesters: [],
    DADOS_FORNECEDORES: [objectDataQRCode?]
}



function HorizontalLinearStepper() {
    const router = useRouter()
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const [openSnack, setOpenSnack] = useState(false)
    const [remainingVariables, setRemainingVariables] = useState([])
    const [openDialogRegister, setOpenDialogRegister] = useState(false)
    const dataPlan = useRef<dataPlanType>({
        DataQRCode: [],
        Dados_Stock: [],
        Requesters: [],
        DADOS_FORNECEDORES: []
    
    })
    const [valuesSelect, setValuesSelect] = useState({
        data: [],
        index: 0,
        listCollunm: [],
        valueColumnSelect: '',
        listValueSlect: [],
        value: ""

    })
    const [requesterType, setRequesterType] = useState<"qrcode" | "list">('list')
    const collunsRequesters = useRef([])
    const [progressConstructonPDF, setProgesstConstructonPDF] = useState({
        isDone: false,
        progress: 0,
    })

    useEffect(() => {
        ipcRenderer.on('setProgress', (ev, progress) => {
            setProgesstConstructonPDF({ isDone: progress === 100 ? true : false, progress })
            console.log(progress)


        })
    }, [])







    const checkValues = () => {
        switch (activeStep) {
            case 0:
                setRemainingVariables([

                    {
                        label: "ALMOXARIFE",
                        typeInput: "",
                        value: "ALMOXARIFE",
                        valueInput: "",
                    },
                    {
                        label: "REQUESITANTE",
                        typeInput: "",
                        value: "REQUESITANTE",
                        valueInput: "",
                    }
                ])
                return dataPlan.current.Dados_Stock.length > 0 ? true : false


            case 1:
                return handleFinish()
            default:
                return true
        }
    }

    ///////////////// sptep 01

    const handleGetPlan = () => {
        dataPlan.current = {...ipcRenderer.sendSync('getPlan')}
        console.log(dataPlan.current)
    }
    //////////// step 2




    const handleSelectColumn = ({ target }) => {
        const { value } = target
        let newValue = valuesSelect
        newValue.valueColumnSelect = value

        console.log(remainingVariables[newValue.index])
        setValuesSelect({ ...newValue })

    }
    const handleDoneSelectValue = () => {
        let newValue = remainingVariables
        if (valuesSelect.valueColumnSelect !== "") {
            newValue[valuesSelect.index].valueColumnSelect = valuesSelect.data.map(item => item[valuesSelect.valueColumnSelect])
            newValue[valuesSelect.index].valueInput = newValue[valuesSelect.index].valueColumnSelect[0]

            // console.log(newValue[[valuesSelect.index]])

            setRemainingVariables([...newValue])
            setValuesSelect({
                data: [],
                index: 0,
                listCollunm: [],
                valueColumnSelect: '',
                listValueSlect: [],
                value: ""
            })
            console.log(remainingVariables)
            setOpenDialogRegister(false)

        }

    }

    const handleFinish = () => {
        // const valuesQrCode = dataPlan.current.DataQRCode.map((row, index) =>  `${}`)
        const desCriptionLabel = dataPlan.current.DataQRCode.map((row, i)=> `${row?.CODIGO} - ${row?.DESCRICAO
        }`)
        
        console.log(desCriptionLabel)
        
        ipcRenderer.send('createQrCode', [dataPlan.current.DataQRCode, desCriptionLabel])
       
        return true




    }


    const handleGetDataCloud = () => {
        router.push('/viewTable')
        // console.log(ipcRenderer.sendSync('getCloudData'))
    }









    ///// mundaça de steps
    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        const isCheck = checkValues()
        if (isCheck) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        } else {
            setOpenSnack(true)

        }


    };

    const steps = getSteps();
    const isStepOptional = (step: number) => {
        return step > 10
    };


    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };



    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
     
        setRemainingVariables([])
        setValuesSelect({
            data: [],
            index: 0,
            listCollunm: [],
            valueColumnSelect: '',
            listValueSlect: [],
            value: ""
        })
        setProgesstConstructonPDF({
            isDone: false,
            progress: 0,
        })

        setActiveStep(0);
    };


    function getStepContent(step: number) {
        switch (step) {
            // case 0:
            //     return <SelectFunction
            //         onChange={({target})=>{setFunctionSelect(target.value)}}
            //         value={functionSelect}
            //     />  
            case 0:
                return <Button onClick={() => {
                    handleGetPlan()
                }}>
                    Selecione a Planilha
                </Button>
            // case 1:
            //     return <>
            //         <DefineVariablePlan
            //             listKeys={keysStaticPlan}
            //             onChange={handleOnChangeInputs}
            //             listVariable={variable}
            //         />
            //     </>
            case 1:
                return <>

                    <TypeInput
                        onChange={(value) => setRequesterType(value)}
                        value={requesterType}

                    />
                </>;
            default:
                return 'Unknown step';
        }
    }
    return (
        <div className={classes.root}>

            <Grid container
                justify='space-around'
                alignItems='center'

            >

                <Grid item xs={6}>
                    <Button className={classes.buutonStyle}
                        onClick={() => router.back()}
                    >
                        Retornar
                    </Button>   
                </Grid>
                <Grid item xs={6}>
                    <img style={{ width: "200px" }} src="/images/resute2.png" />


                </Grid>



            </Grid>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={index} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <div

            >
                {activeStep === steps.length ? (
                    <Grid container
                        spacing={2}
                        direction="column"
                        justify="center"
                        alignItems="center">
                        <Typography className={classes.instructions}>
                            {
                                !progressConstructonPDF.isDone ?
                                    "Criando pdf contendo os Qr Codes... " :
                                    "Pdf Criado!"
                            }

                        </Typography>
                        <CircularProgressWithLabel value={progressConstructonPDF.progress} />
                        <Button disabled={!progressConstructonPDF.isDone} onClick={handleReset} className={classes.buutonStyle}>
                            Reset
                        </Button>
                    </Grid>
                ) : (
                    <div>
                        <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                        <div>
                            <Button disabled={activeStep === 0} onClick={handleBack} style={{ margin: '20px' }} className={classes.buutonStyle}>
                                Voltar
                            </Button>
                            {isStepOptional(activeStep) && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSkip}
                                    className={classes.button}
                                >
                                    Pular
                                </Button>
                            )}

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <Snackbar open={openSnack} autoHideDuration={6000} onClose={() => setOpenSnack(false)} message="Preencha todo formulário corretamente!" />
            <DialogRegister
                onCancel={() => { }}
                onDone={() => handleDoneSelectValue()}
                open={openDialogRegister}
                valuesSelect={valuesSelect}
                onClose={() => setOpenDialogRegister(false)}
                onChange={handleSelectColumn}

            />
        </div>
    );
}

export default HorizontalLinearStepper;
