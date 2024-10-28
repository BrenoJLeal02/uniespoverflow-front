import { ReactNode, useEffect, useState } from 'react';
import {
  Box,
  useColorModeValue,
  useDisclosure,
  useBreakpointValue,
  InputGroup,
  Input,
  InputLeftElement,
} from '@chakra-ui/react';
import SidebarContent from './SidebarContent';
import MobileNav from './SidebarHeader';
import { FiSearch } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';

interface SidebarProps {
  children: ReactNode;
}

export default function SimpleSidebar({ children }: SidebarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchVisible, setSearchVisible] = useState(false);
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const { token } = useAuthStore();
  const { user, getProfile } = useProfileStore();

  const toggleSearch = () => setSearchVisible(!searchVisible);
  const showSearchInput =
    useBreakpointValue({ base: false, md: true }) ?? false;

  const checkAuth = async (token?: string) => {
    try {
      if (token) {
        getProfile(token);
      }
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    }
  };

  useEffect(() => {
    checkAuth(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.100', 'gray.900')}
      position="relative"
    >
      <SidebarContent
        isUserLoggedIn={!!user}
        isOpen={isOpen}
        onClose={onClose}
      />
      <MobileNav
        onOpen={onOpen}
        toggleSearch={toggleSearch}
        showSearchInput={showSearchInput}
        user={user}
      />
      <Box p="4" position="relative" zIndex={1} ml={isDesktop ? '250px' : '0'}>
        {children}
      </Box>

      {!isDesktop && searchVisible && (
        <>
          <Box mt={2} px={4} zIndex={2} position="relative" top={-16}>
            <InputGroup>
              <InputLeftElement children={<FiSearch color="#000" />} />
              <Input
                bg="white"
                borderRadius={6}
                focusBorderColor="#fff"
                placeholder="Buscar"
                _placeholder={{ color: '#A0AEC0' }}
              />
            </InputGroup>
          </Box>
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bg="black"
            opacity="0.5"
            zIndex={1}
            onClick={toggleSearch}
          />
        </>
      )}

      {!isDesktop && isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="black"
          opacity="0.5"
          zIndex={1}
          onClick={onClose}
        />
      )}
    </Box>
  );
}
