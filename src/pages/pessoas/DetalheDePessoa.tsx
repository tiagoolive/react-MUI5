import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FerramentasDeDetalhe } from '../../shared/components'
import { VTextField } from '../../shared/forms'
import { LayoutBaseDePagina } from './../../shared/layouts/LayoutBaseDePagina'
import { PessoasService } from './../../shared/services/api/pessoas/PessoasService'


interface IFormData {
  email: string
  cidadeId: number
  nomeCompleto: string
}

export const DetalheDePessoa: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>()
  const navegate = useNavigate()

  const formRef = useRef<FormHandles>(null)

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
    }
  }, [id])

  const handleSave = (dados: IFormData) => {
    setIsLoading(true)

    if (id === 'nova') {
      PessoasService
        .create(dados)
        .then((result) => {
          setIsLoading(false)

          if (result instanceof Error) {
            alert(result.message)
          } else {
            navegate(`/pessoas/detalhe/${result}`)
          }
        })
    } else {
      PessoasService
        .updateById(Number(id), dados)
        .then((result) => {
          setIsLoading(false)

          if (result instanceof Error) {
            alert(result.message)
          }
        })
    }
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

          aoClicarEmSalvar={() => formRef.current?.submitForm()}
          aoClicarEmSalvarEFechar={() => formRef.current?.submitForm()}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navegate('/pessoas')}
          aoClicarEmNovo={() => navegate('/pessoas/detalhe/nova')}
        />
      }
    >

      <Form ref={formRef} onSubmit={handleSave}>
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
                <VTextField
                  fullWidth
                  label='Cidade'
                  name='cidadeId'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </Form>

    </LayoutBaseDePagina>
  )
}
