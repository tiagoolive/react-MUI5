import { Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import * as yup from 'yup'

import { useAuthContext } from '../../contexts'


interface ILoginProps {
  children: React.ReactNode
}

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(5)
})

export const Login: React.FC<ILoginProps> = ({ children }) => {

  const { isAuthenticated, login } = useAuthContext()

  const [isLoading, setIsLoading] = useState(false)

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = () => {
    setIsLoading(true)
    loginSchema
      .validate({ email, password }, {abortEarly: false})
      .then(dadosValidados => {
        login(dadosValidados.email, dadosValidados.password)
          .then(() => {
            setIsLoading(false)
          })
      })
      .catch((errors: yup.ValidationError) => {
        setIsLoading(false)
        errors.inner.forEach(error => {
          if(error.path === 'email'){
            setEmailError(error.message)
          } else if (error.path === 'password'){
            setPasswordError(error.message)
          }
        }) 
      })
  }

  if (isAuthenticated) return (
    <>{children}</>
  )

  return (
    <Box width='100vw' height='100vh' display='flex' justifyContent='center' alignItems='center'>
      <Card>
        <CardContent>
          <Box display='flex' flexDirection='column' gap={2} width={250}>
            <Typography variant='h6' align='center'>Indentifique-se</Typography>

            <TextField
              fullWidth
              label='Email'
              type='email'
              value={email}             
              disabled={isLoading}
              error={!!emailError}
              helperText={emailError}
              onChange={e => setEmail(e.currentTarget.value)}
              onKeyDown={e => setEmailError('')}
            />

            <TextField
              fullWidth
              label='Senha'
              type='password'
              value={password}
              disabled={isLoading}
              error={!!passwordError}
              helperText={passwordError}
              onChange={e => setPassword(e.currentTarget.value)}
              onKeyDown={e => setPasswordError('')}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Box width='100%' display='flex' justifyContent='center'>

            <Button
              variant='contained'
              onClick={handleSubmit}
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
            >
              Entrar
            </Button>

          </Box>

        </CardActions>
      </Card>
    </Box>
  )
}
