import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { PostCard } from '../../components/PostCard/PostCard';
import { useState, useEffect } from 'react';
import { usePostStore } from '../../store/postStore';

export function HomePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { setPosts, getPosts } = usePostStore();

  const posts = getPosts(); 

  useEffect(() => {
    const getPostsList = async () => {
      setLoading(true);
      try {
        await setPosts(''); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getPostsList();
  }, [setPosts]); 

  return (
    <Box display="flex" justifyContent="center" height="100vh">
      <Tabs colorScheme="#281A45 | gray.400" isFitted variant="line" width="100%">
        <TabList>
          <Tab width="50%" fontSize="xl">
            Recentes
          </Tab>
          <Tab width="50%" fontSize="xl">
            Relevantes
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {loading && <p>Carregando...</p>}

            <Flex direction="column" gap="15px">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <Box key={post.id} borderBottom="1px solid #B6B4BB" paddingBottom="10px">
                    <PostCard post={post} />
                  </Box>
                ))
              ) : (
                !loading && <p>Nenhum post encontrado</p>
              )}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
