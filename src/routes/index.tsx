import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard, DetalheDeCidade, DetalheDePessoa, ListagemDeCidades, ListagemDePessoas } from '../pages'
import { useDrawerContext } from './../shared/contexts'


export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext()

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página Inicial'
      },
      {
        icon: 'location_city',
        path: '/cidades',
        label: 'Cidades'
      },
      {
        icon: 'people',
        path: '/pessoas',
        label: 'Pessoas'
      }
    ])
  }, [])

  return (
    <Routes>
      <Route  path='/pagina-inicial' element={<Dashboard />} />

      <Route path='/pessoas' element={<ListagemDePessoas />} />
      <Route path='/pessoas/detalhe/:id' element={<DetalheDePessoa />} />
      
      <Route path='/cidades' element={<ListagemDeCidades />} />
      <Route path='/cidades/detalhe/:id' element={<DetalheDeCidade />} />

      <Route path='*' element={<Navigate to={'/pagina-inicial'} />} />
    </Routes>
  )
}
