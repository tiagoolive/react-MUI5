import { LinearProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { FerramentasDeDetalhe } from '../../shared/components'
import { LayoutBaseDePagina } from './../../shared/layouts/LayoutBaseDePagina'
import { PessoasService } from './../../shared/services/api/pessoas/PessoasService'


export const DetalheDePessoa: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>()
  const navegate = useNavigate()

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
            console.log(result)
          }
        })
    }
  }, [id])

  const handleSave = () => {
    console.log('Save')
  }

  const handleDelete = (id: number) => {
    if(confirm('Realmente deseja apagar?')){
      PessoasService.deleteById(id)
        .then(result => {
          if(result instanceof Error){
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

          aoClicarEmSalvar={handleSave}
          aoClicarEmSalvarEFechar={handleSave}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navegate('/pessoas')}
          aoClicarEmNovo={() => navegate('/pessoas/detalhe/nova')}
        />
      }
    >

      {isLoading && (
        <LinearProgress variant='indeterminate' />
      )}

      <p>DetalheDePessoa {id}</p>

    </LayoutBaseDePagina>
  )
}
