import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router'
import { Button, Input, Grid, Typography, TextField, Divider, } from '@material-ui/core';
import { ipcRenderer } from 'electron'
import { SelectText, StandartInput } from '../components/Inpusts'
import { SimpleDialog } from '../components/dialog'
import CreateInput from '../components/createInputs'
import CreateValuesInputs from '../components/createValue'
// import { SiGooglesheets, SiMicrosoftexcel } from "react-icons/si";
// import { AiFillFolderOpen } from "react-icons/ai";

import useStyles from '../lib/styles'


function Home() {
  const router = useRouter()
  const classes = useStyles({})

  const listTypes = [{
    label: 'Texto', value: "default"
  },
  { label: 'Número', value: "numeric" }
  ]
  const listTypesCreate = [
    {
      label: 'Dia/Més/Ano', value: "DD/MM/YYYY"
    },
    { label: 'Més/Ano', value: "MM/YYYY" },
    { label: 'Horá:Minuto', value: "HH:mm" }
  ]
  const [Inputs, setInputs] = useState([{
    name: "",
    type: "",
    label: "",
    value: "",

  }])
  const [createValues, setCreateValues] = useState([
    {
      name: "",
      type: "",
    }
  ])
  const [descriptionPlan, setDescriptionPlan] = useState('')
  const pathPlan = useRef('')
  const pathDirectory = useRef('')
  const [openDialogPlan, setOpenDialogPlan] = useState(false)
  const [openSucc, setOpenSucc] = useState(false)
  const [paths, setPaths] = useState({
    plan: "",
    directoryData: ""
  })

  const getPlan = () => {

    let newPaths = paths
    newPaths.plan = ipcRenderer.sendSync('getPlan')
    setPaths({ ...newPaths })

  }
  const getDirectory = () => {
    let newPaths = paths
    newPaths.directoryData = ipcRenderer.sendSync('getPlan')
    setPaths({ ...newPaths })

  }

  const handleOnChangeInputs = ({ target }, i, type) => {
    const { name, value } = target
    let newValues = type === 'create' ? createValues : Inputs
    newValues[i][name] = value
    setCreateValues([...newValues])
    // if (type === 'create') {
    //   setCreateValues([...newValues])
    // } else {
    //   setInputs([...newValues])
    // }



  }


  const handleAddInput = (type) => {
    if (type !== "create") {

      setInputs([...Inputs, {
        name: "",
        type: "",
        label: "",
        value: "",
      }])
    } else {
      setCreateValues([
        ...createValues, {
          name: "",
          type: "",
        }
      ])

    }




  }
  const handleRemoveInput = (type) => {



    if (type === 'create') {
      let newValues = createValues
      newValues.splice(newValues.length - 1, 1)
      if (newValues.length > 0) {
        setCreateValues([...newValues])
      }

    } else {
      let newValues = Inputs
      newValues.splice(newValues.length - 1, 1)
      if (newValues.length > 0) {
        setInputs([...newValues])
      }

    }



  }

  const handleNextStep = () => {

  }


  const handleSubmit = (e) => {

    // console.log(id)

    const dataQrCode = {
      pathPlan: pathPlan.current,
      pathDirectory: pathDirectory.current,
      createValues: createValues,
      Inputs: Inputs,
      description: descriptionPlan
    }
    if (pathPlan.current !== "" && pathDirectory.current !== "") {
      const createQrCode = ipcRenderer.sendSync('createQrCode', dataQrCode)
      // console.log(createQrCode)
      const saveListXlsx = ipcRenderer.sendSync('saveDesciptionPlan', dataQrCode)
      setOpenSucc(true)
      setInputs([])
      setCreateValues([])
      setPaths({
        plan: "",
        directoryData: ""
      })
      setDescriptionPlan('')
      pathPlan.current = ""
      pathDirectory.current = ""


    } else {
      setOpenDialogPlan(true)



    }

    console.log(dataQrCode)

    e.preventDefault();
    e.stopPropagation();
  }

  return (


    <Grid
      className={classes.root}
      container
      spacing={2}
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={6}>
        <StandartInput
          label="Descrição da planilha"
          name='descriptionPlan'          
          value={descriptionPlan}
          onChange={(ev) => setDescriptionPlan(ev.target.value)}

        />
      </Grid>


      {/* <Grid item xs={12}>
        <Grid
          // className={classes.root}
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Button
            onClick={() => router.push('/createXlsx')}
            className={classes.buutonStyle}>

            Gerar Planilha
      </Button>

        </Grid>


      </Grid>
      <Grid item xs={12}>
        <Typography variant='h2'>
          Gerador de QR Code
       </Typography>

      </Grid> */}

      {/* <Grid item xs={6}>
        <Button
          className={classes.buttonSelect}
          style={{ background: paths.plan !== "" ? '#00cc00' : '#e6e600' }}
          onClick={() => getPlan()}
        >

          Selecionar Planilha
          <SiMicrosoftexcel
            style={{ margin: "5px" }}
            size='2em' />
        </Button>

      </Grid>
      <Grid item xs={6}>

        <Button
          className={classes.buutonStyle}
          style={{ background: paths.directoryData !== "" ? '#00cc00' : '#e6e600' }}
          onClick={() => getDirectory()}
        >
          Selecionar Pasta de Destino
          <AiFillFolderOpen
            style={{ margin: "5px" }}
            size='2em' 
          />
        </Button>
      </Grid> */}

      {/* <Grid item xs={12}>
        <Button onClick={()=>{}}>Próximo passo</Button>
      </Grid>
      <form onSubmit={handleSubmit}>
        <Grid

          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={6}>
            <StandartInput
              label="Descrição da planilha"
              variant='outlined'
              fullWidth
              value={descriptionPlan}
              onChange={(ev) => setDescriptionPlan(ev.target.value)}

            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h5'>
              Inputs
       </Typography>
          </Grid>
          <CreateInput
            Inputs={Inputs}
            handleOnChangeInputs={handleOnChangeInputs}
            listTypes={listTypes}
          />

          <Grid item xs={3}>
            <Button
              onClick={() => handleAddInput()}
              className={classes.buutonStyle}>
              Add
      </Button>

          </Grid>
          <Grid item xs={3}>

            <Button
              onClick={() => handleRemoveInput()}
              className={classes.buutonStyle}>
              Remover
      </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h5'>
              Gerar Valores
       </Typography>
          </Grid>
          <CreateValuesInputs
            createValues={createValues}
            handleOnChangeInputs={handleOnChangeInputs}
            listTypesCreate={listTypesCreate}
          />
          <Grid item xs={3}>
            <Button
              onClick={() => handleAddInput('create')}
              className={classes.buutonStyle}>
              Add
      </Button>

          </Grid>
          <Grid item xs={3}>

            <Button
              onClick={() => handleRemoveInput('create')}
              className={classes.buutonStyle}>
              Remover
      </Button>
          </Grid>
          <Grid item xs={12}>

            <Button
              type='submit'

              className={classes.buutonStyle}>
              Gerar QrCode's
            </Button>
          </Grid>
        </Grid>
      </form>
      <SimpleDialog
        open={openDialogPlan}
        onClose={() => setOpenDialogPlan(false)}
        body="Selecione a planilha e a pasta de destino!"
      />
      <SimpleDialog
        open={openSucc}
        onClose={() => setOpenSucc(false)}
        body={`QrCode's criado com sucesso, no diretório ${pathDirectory.current}!`}
      /> */}
    </Grid>


  );
};

export default Home;
