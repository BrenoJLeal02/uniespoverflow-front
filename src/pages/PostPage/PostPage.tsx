import {
  Divider,
  Tag,
  Box,
  Text,
  useBreakpointValue,
  Tabs,
  Flex,
} from '@chakra-ui/react';
import { AiOutlineUnlock, AiOutlineLock } from 'react-icons/ai';
import { MdArrowUpward } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { UUID } from 'crypto';
import { DataText } from '../../components/DataText/DataText';
import MenuPostComponent from '../../components/MenuPostComponent/MenuPostComponent';
import { CommentList } from '../../components/CommentList/CommentList';

import { usePostStore } from '../../store/postStore';
import {CreateUserComment } from '../../components/CreateUserComment/CreateUserComment';

export function PostPage() {
  const { id } = useParams<{ id: string | UUID }>(); 
  const { post, getPostById,incrementCommentCount } = usePostStore();
  const [loading] = useState<boolean>(false);
  const isDesktop = useBreakpointValue({ base: false, md: true });
  
  const getPost = async (id: string | UUID) => {
    if (!id) return;
    try {
      await getPostById(id);
    } catch (error) {
      console.error('Erro ao buscar post:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getPost(id);
    }
  }, [id]);


  if (loading) return <Text>Carregando...</Text>;
  if (!post) return <Text>Post não encontrado</Text>;

  return (
    <Box>
      <Box mt="39px" display="flex" gap="35px">
        <Text
          color="#805AD5"
          fontSize="14px"
          fontWeight="500"
          lineHeight="20px"
        >
          @{post.username}
        </Text>
        <Text
          marginRight={isDesktop ? '350px' : '100px'}
          fontSize="12px"
          fontWeight="500"
          color="#515151"
        >
          <DataText created={post.created_at} updated={post.updated_at} sufix />
        </Text>
        <MenuPostComponent />
      </Box>

      <Text
        mt={isDesktop ? '24px' : '9px'}
        color="#000"
        fontSize="16px"
        fontWeight="600"
      >
        {post.title}
      </Text>

      <Box mt={isDesktop ? '24px' : '8px'} display="flex" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center">
          <MdArrowUpward style={{ width: '20px', height: '24px' }} />
          <Text fontSize="16px" fontWeight="600" color="#000">
            {post.score}
          </Text>
        </Box>
        <Text
          width="296px"
          marginLeft="37px"
          mt="8px"
          color="#111"
          fontSize="14px"
          fontWeight="500"
        >
          {post.description}
        </Text>
      </Box>

      <Box marginLeft={isDesktop ? '440px' : '126px'} mt="28px" display="flex">
        {post.tags.map((tag, index) => (
          <Tag
            key={index}
            size="md"
            variant="solid"
            colorScheme="purple"
            marginLeft={index > 0 ? '14px' : '0'}
          >
            {tag}
          </Tag>
        ))}
      </Box>

      <Box>
        <Divider mt="15px" background="#DEDEDE" height="1px" />
        <Flex gap="15px">
          <Text
            mt="5px"
            color="#515151"
            fontSize="12px"
            fontWeight="500"
          >
            {post.score} curtida{post.score!== 1 ? 's' : ''}
          </Text>
          <Text
            mt="5px"
            color="#515151"
            fontSize="12px"
            fontWeight="500"
          >
            {post.comment.length} comentário{post.comment.length !== 1 ? 's' : ''}
          </Text>
        </Flex>

      </Box>

      <CommentList comments={post.comment} refreshComments={() => id && getPost(id)} /> 
      
      <CreateUserComment
        postId={id as string}
        incrementCommentCount={incrementCommentCount}
        getPost={getPost}
      />

      <Divider
        mt="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      ></Divider>
      <Tabs
        borderBottom="2px solid #281A45 "
        mt="16px"
        variant="line"
        display="flex"
        width={isDesktop ? '655px' : '100%'}
        height="54px"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          color="#281A45"
          textAlign="center"
          fontSize="18px"
          fontWeight="500"
        >
          Relacionados
        </Text>
      </Tabs>
      <Box>
        <Box
          mt="62px"
          color="#515151"
          fontSize="12px"
          fontWeight="500"
          lineHeight="24px"
          display="flex"
        >
          <Text paddingRight="26px">7 curtidas</Text>
          <Text paddingRight={isDesktop ? '450px' : '135px'}>
            4 comentários
          </Text>
          <AiOutlineUnlock style={{ width: '20px', height: '20px' }} />
        </Box>
        <Text
          width="327px"
          color="#000"
          mt="9px"
          fontSize="16px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="24px"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <Text
          width="339px"
          height="85px"
          flexDirection="column"
          justifyContent="center"
          display="flex"
          color="#111"
          fontSize="14px"
          fontWeight="500"
          lineHeight="24px"
        >
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flexDirection="column" display="flex" gap="8px">
            <Tag
              mt="6px"
              size="md"
              variant="solid"
              colorScheme="purple"
              display="inline-flex"
              height="24px"
              padding="0px 8px"
              alignItems="center"
              gap="8px"
              borderRadius="6px"
            >
              Tag name
            </Tag>
            <Tag
              size="md"
              variant="solid"
              colorScheme="purple"
              display="inline-flex"
              height="24px"
              padding="0px 8px"
              alignItems="center"
              gap="8px"
              borderRadius="6px"
              background="#4B6820"
            >
              Tag number 2
            </Tag>
          </Box>
          <Box alignItems="flex-end" flexDirection="column" display="flex">
            <Text
              color="#515151"
              fontSize="12px"
              fontWeight="500"
              lineHeight="20px"
            >
              <DataText
                created={post.created_at}
                updated={post.updated_at}
                sufix
              />
            </Text>
            <Text
              color="#805AD5"
              fontSize="12px"
              fontWeight="500"
              lineHeight="20px"
            >
              @username
            </Text>
          </Box>
        </Box>
      </Box>
      <Divider mt="19px"></Divider>
      <Box>
        <Box
          mt="32px"
          color="#515151"
          fontSize="12px"
          fontWeight="500"
          lineHeight="24px"
          display="flex"
        >
          <Text paddingRight="26px">21 curtida</Text>
          <Text paddingRight={isDesktop ? '450px' : '135px'}>
            12 comentários
          </Text>
          <AiOutlineLock style={{ width: '20px', height: '20px' }} />
        </Box>
        <Text
          width="327px"
          color="#000"
          mt="9px"
          fontSize="16px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="24px"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <Text
          width="339px"
          height="85px"
          flexDirection="column"
          justifyContent="center"
          display="flex"
          color="#111"
          fontSize="14px"
          fontWeight="500"
          lineHeight="24px"
        >
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flexDirection="column" display="flex" gap="8px">
            <Tag
              mt="6px"
              size="md"
              variant="solid"
              colorScheme="purple"
              display="inline-flex"
              height="24px"
              padding="0px 8px"
              alignItems="center"
              gap="8px"
              borderRadius="6px"
            >
              Tag name
            </Tag>
          </Box>
          <Box alignItems="flex-end" flexDirection="column" display="flex">
            <Text
              color="#515151"
              fontSize="12px"
              fontWeight="500"
              lineHeight="20px"
            >
              <DataText
                created={post.created_at}
                updated={post.updated_at}
                sufix
              />
            </Text>
            <Text
              color="#805AD5"
              fontSize="12px"
              fontWeight="500"
              lineHeight="20px"
            >
              @usernam
            </Text>
          </Box>
        </Box>
      </Box>
      <Divider mb="37px" mt="37px"></Divider>
    </Box>
  );
}
