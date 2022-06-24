import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material'

interface IBarraDeFerramentasProps {
  textoDaBusca?: string,
  mostrarInuputBusca?: boolean,
  aoMudarTextDaBusca?: (novoTexto: string) => void
  textoBotaoNovo?: string,
  mostrarBotaoNovo?: boolean,
  aoClicarEmEventoNovo?: () => void
}

export const BarraDeFerramentas: React.FC<IBarraDeFerramentasProps> = ({
  textoDaBusca = '',
  mostrarInuputBusca = false,
  aoMudarTextDaBusca,
  aoClicarEmEventoNovo,
  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true
}) => {
  const theme = useTheme()

  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      alignItems="center"
      height={theme.spacing(5)}
      component={Paper}
    >
      <Icon >search</Icon>
      {mostrarInuputBusca && (
        <TextField
          size='small'
          value={textoDaBusca}
          onChange={(e) => aoMudarTextDaBusca?.(e.target.value)}
          placeholder='Pesquisar...'
        />
      )}

      <Box flex={1} display="flex" justifyContent="end">
        {mostrarBotaoNovo && (
          <Button
            color='primary'
            disableElevation
            variant='contained'
            onClick={aoClicarEmEventoNovo}
            endIcon={<Icon>add</Icon>}
          >{textoBotaoNovo}</Button>
        )}
      </Box>
    </Box>
  )
}
