import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import { FerramentasDeDetalhe } from '../../shared/components'
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms'
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePagina'
import { CidadesService } from '../../shared/services/api/cidades/CidadesService'


interface IFormData {
  nome: string
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
})

export const DetalheDeCidade: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>()
  const navegate = useNavigate()

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm()

  const [isLoading, setIsLoading] = useState(false)
  const [nome, setNome] = useState('')

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true)

      CidadesService.getById(Number(id))
        .then((result) => {
          setIsLoading(false)

          if (result instanceof Error) {
            alert(result.message)
            navegate('/cidades')
          } else {
            setNome(result.nome)

            formRef.current?.setData(result)
          }
        })
    } else {
      formRef.current?.setData({
        nome: ''
      })
    }
  }, [id])

  const handleSave = (dados: IFormData) => {

    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true)

        if (id === 'nova') {
          CidadesService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false)

              if (result instanceof Error) {
                alert(result.message)
              } else {
                if (isSaveAndClose()) {
                  navegate('/cidades/')
                } else {
                  navegate(`/cidades/detalhe/${result}`)
                }
              }
            })
        } else {
          CidadesService
            .updateById(Number(id), dadosValidados)
            .then((result) => {
              setIsLoading(false)

              if (result instanceof Error) {
                alert(result.message)
              } else {
                if (isSaveAndClose()) {
                  navegate('/cidades/')
                }
              }
            })
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {}

        errors.inner.forEach(error => {
          if(!error.path) return

          validationErrors[error.path] = error.message
        })
        
        console.log(validationErrors)
        formRef.current?.setErrors(validationErrors)
      })



  }

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      CidadesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message)
          } else {
            alert('Registro apagado com sucesso')
            navegate('/cidades')
          }
        })
    }
  }

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova cidade' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navegate('/cidades')}
          aoClicarEmNovo={() => navegate('/cidades/detalhe/nova')}
        />
      }
    >

      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>
          <Grid container direction='column' padding={2} spacing={2}>

            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label='Nome'
                  name='nome'
                  disabled={isLoading}
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>

    </LayoutBaseDePagina>
  )
}
