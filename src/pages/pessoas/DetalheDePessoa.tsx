import { useNavigate, useParams } from 'react-router-dom'

import { FerramentasDeDetalhe } from '../../shared/components'
import { LayoutBaseDePagina } from './../../shared/layouts/LayoutBaseDePagina'


export const DetalheDePessoa: React.FC = () => {
  const { id = 'nova' } = useParams<'id'>()
  const navegate = useNavigate()

  const handleSave = () => {
    console.log('Save')
  }

  const handleDelete = () => {
    console.log('Save')
  }

  return (
    <LayoutBaseDePagina 
      titulo='Detalhe de pessoa'
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={handleSave}
          aoClicarEmSalvarEFechar={handleSave}
          aoClicarEmApagar={handleDelete}
          aoClicarEmVoltar={() => navegate('/pessoas')}
          aoClicarEmNovo={() => navegate('/pessoas/detalhe/nova')}
        />
      }
    >
      <p>DetalheDePessoa {id}</p>

    </LayoutBaseDePagina>
  )
}
