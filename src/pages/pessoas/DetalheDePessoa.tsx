import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import { FerramentasDeDetalhe } from '../../shared/components'
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms'
import { LayoutBaseDePagina } from './../../shared/layouts/LayoutBaseDePagina'
import { PessoasService } from './../../shared/services/api/pessoas/PessoasService'
import { AutoCompleteCidade } from './components/AutoCompleteCidade'


interface IFormData {
  email: string
  cidadeId: number
  nomeCompleto: string
}

const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nomeCompleto: yup.string().required().min(3),
  email: yup.string().required().email(),
  cidadeId: yup.number().required(),
})

export const DetalheDePessoa: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>()
  const navegate = useNavigate()

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm()

  const [isLoading, setIsLoading] = useState(false)
  const [nome, setNome] = useState('')

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true)

      PessoasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false)

          if (result instanceof Error) {
            alert(result.message)
            navegate('/pessoas')
          } else {
            setNome(result.nomeCompleto)

            formRef.current?.setData(result)
          }
        })
    } else {
      formRef.current?.setData({
        nomeCompleto: '',
        email: '',
        cidadeId: undefined
      })
    }
  }, [id])

  const handleSave = (dados: IFormData) => {

    formValidationSchema
      .validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true)

        if (id === 'nova') {
          PessoasService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false)

              if (result instanceof Error) {
                alert(result.message)
              } else {
                if (isSaveAndClose()) {
                  navegate('/pessoas/')
                } else {
                  navegate(`/pessoas/detalhe/${result}`)
                }
              }
            })
        } else {
          PessoasService
            .updateById(Number(id), dadosValidados)
            .then((result) => {
              setIsLoading(false)

              if (result instanceof Error) {
                alert(result.message)
              } else {
                if (isSaveAndClose()) {
                  navegate('/pessoas/')
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
      PessoasService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message)
          } else {
            alert('Registro apagado com sucesso')
            navegate('/pessoas')
          }
        })
    }
  }

  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova pessoa' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navegate('/pessoas')}
          aoClicarEmNovo={() => navegate('/pessoas/detalhe/nova')}
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
                  label='Nome Completo'
                  name='nomeCompleto'
                  disabled={isLoading}
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label='Email'
                  name='email'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={12} md={6} lg={4} xl={2}>
                <AutoCompleteCidade isExternalLoading={isLoading} />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>

    </LayoutBaseDePagina>
  )
}
