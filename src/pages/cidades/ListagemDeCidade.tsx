import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FerramentasDaListagem } from '../../shared/components'
import { LayoutBaseDePagina } from '../../shared/layouts'




export const ListagemDeCidade: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const busca = useMemo(() => {
    return searchParams.get('busca') || ''    
  }, [searchParams])

  return (
    <LayoutBaseDePagina
      titulo={'Listagem de Cidades'}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInuputBusca
          textoBotaoNovo='Nova'
          textoDaBusca={busca}
          aoMudarTextDaBusca={texto => setSearchParams({busca: texto}, {replace: true})}
        />
      }
    >

    </LayoutBaseDePagina>
  )
}
