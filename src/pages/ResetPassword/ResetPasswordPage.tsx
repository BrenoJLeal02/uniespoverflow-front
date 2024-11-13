import { useState, FormEvent } from 'react';
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Box,
  Text,
  Flex,
  useToast,
  Image,
  useBreakpointValue,
} from '@chakra-ui/react';
import { resetPassword } from '../../service/Auth';
import logoAuth from '../../assets/logoAuth.svg';
import { useNavigate, useLocation } from 'react-router-dom';

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const getTokenFromUrl = (): string | null => {
    const params = new URLSearchParams(location.search);
    return params.get('token');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = getTokenFromUrl();

    if (!token) {
      setError('Token de autenticação ausente.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      await resetPassword({ newPassword, token });
      toast({
        title: 'Senha alterada com sucesso',
        description: `Sua senha foi alterada com sucesso!! Você já pode acessar sua conta.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      navigate('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro inesperado!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      padding="16px"
    >
      <Box width="476px">
        <Image
          src={logoAuth}
          margin={'10px auto'}
          alt="Logo"
          width={isDesktop ? '170px' : '140px'}
        />
        <form onSubmit={handleSubmit}>
          <Flex flexDirection="column" alignItems="center">
            <FormControl mb="4">
              <FormLabel htmlFor="newPassword">Nova Senha</FormLabel>
              <Input
                display="flex"
                placeholder="Digite sua nova senha"
                bg="gray.50"
                border="2px solid"
                borderColor="#805AD5"
                focusBorderColor="#805AD5"
                _hover={{ bg: 'gray.200' }}
                _focus={{ bg: 'white' }}
                width="100%"
                height="41px"
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                isDisabled={loading}
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel htmlFor="confirmPassword">Confirmar Nova Senha</FormLabel>
              <Input
                display="flex"
                placeholder="Confirme sua nova senha"
                bg="gray.50"
                border="2px solid"
                borderColor="#805AD5"
                focusBorderColor="#805AD5"
                _hover={{ bg: 'gray.200' }}
                _focus={{ bg: 'white' }}
                width="100%"
                height="41px"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isDisabled={loading}
              />
            </FormControl>

            {error && (
              <Text color="red.500" mb="4">
                {error}
              </Text>
            )}

            <Button
              w="100%"
              h="40px"
              mt={5}
              type="submit"
              bg="#805AD5"
              _hover={{ bg: '#9B71E6' }}
              color="#FFF"
              borderRadius="6px"
              isLoading={loading}
              isDisabled={loading}
            >
              Alterar senha
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
}
