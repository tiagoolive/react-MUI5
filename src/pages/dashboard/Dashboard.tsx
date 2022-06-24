import { FerramentasDeDetalhe } from '../../shared/components'
import { LayoutBaseDePagina } from '../../shared/layouts'


export const Dashboard: React.FC = () => {

  return (
    <LayoutBaseDePagina
      titulo='Página Inicial' 
      barraDeFerramentas={(
        <FerramentasDeDetalhe mostrarBotaoSalvarEFechar />
      )} 
    >
      Testando
    </LayoutBaseDePagina>
    
  )
}
