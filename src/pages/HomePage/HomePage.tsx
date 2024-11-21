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
import { UserPostInfo } from '../../interface/UserInterface';
import { fetchPosts } from '../../service/Post';

export function HomePage() {
  //ajustar cores das tabs

  const [posts, setPosts] = useState<UserPostInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getPostsList = async () => {
    setLoading(true);
    try {
      const postsList = await fetchPosts();
      setPosts(postsList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostsList();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="center" height="100vh">
        <Tabs
          colorScheme="#281A45 | gray.400"
          isFitted
          variant="line"
          width="100%"
        >
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
              {loading && <p>carregando...</p>}

              <Flex direction="column" gap="15px">
                {posts.length > 0 &&
                  posts.map((post) => (
                    <Box borderBottom="1px solid #B6B4BB" paddingBottom="10px">
                      <PostCard post={post} />
                    </Box>
                  ))}
              </Flex>

              {!loading && posts.length === 0 && <p>Nenhum post encontrado</p>}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
