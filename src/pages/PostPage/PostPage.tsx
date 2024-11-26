import {
  Divider,
  Tag,
  Box,
  Text,
  useBreakpointValue,
  Tabs,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { UUID } from 'crypto';
import { DataText } from '../../components/DataText/DataText';
import MenuPostComponent from '../../components/MenuPostComponent/MenuPostComponent';
import { CommentList } from '../../components/CommentList/CommentList';
import { CreateUserComment } from '../../components/CreateUserComment/CreateUserComment';

import { usePostStore } from '../../store/postStore';
import { useAuthStore } from '../../store/authStore';

export function PostPage() {
  const { id: postId } = useParams<{ id: string | UUID }>();
  const { post, getPostById, incrementCommentCount, likePost, dislikePost } = usePostStore();
  const { id: currentUserId } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const isDesktop = useBreakpointValue({ base: false, md: true });

  const getPost = useCallback(async (id: string | UUID) => {
    if (!id) return;
    setLoading(true);
    try {
      await getPostById(id);  // Atualiza o post diretamente na store
      setLiked(post?.likedByCurrentUser || false);  // Atualiza o estado 'liked' diretamente
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [getPostById]);
  

  const handleLike = async () => {
    if (!postId || !currentUserId) return;

    try {
      if (liked) {
        await dislikePost(postId); // Dislike the post
      } else {
        await likePost(postId); // Like the post
      }
      setLiked(!liked); // Toggle the 'liked' state
    } catch (error) {
      console.error('Error liking/disliking the post:', error);
    }
  };

  useEffect(() => {
    if (postId) {
      getPost(postId);  // Load the post when the postId changes
    }
  }, [postId, getPost]);  // Dependencies include getPost (which is memoized by useCallback)

  if (loading) return <Text>Loading...</Text>;
  if (!post) return <Text>Post not found</Text>;

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
          <IconButton
            aria-label="Curtir ou descurtir"
            icon={liked ? <FaHeart color="#805AD5" /> : <FaRegHeart />}
            onClick={handleLike}
            background="transparent"
            _hover={{ transform: 'scale(1.1)' }}
            _active={{ transform: 'scale(1.2)' }}
          />
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
          <Text mt="5px" color="#515151" fontSize="12px" fontWeight="500">
            {post.score} curtida{post.score !== 1 ? 's' : ''}
          </Text>
          <Text mt="5px" color="#515151" fontSize="12px" fontWeight="500">
            {post.comment.length} comentário
            {post.comment.length !== 1 ? 's' : ''}
          </Text>
        </Flex>
      </Box>

      <CommentList
        comments={post.comment}
        refreshComments={() => postId && getPost(postId)}
      />

      <CreateUserComment
        postId={postId as string}
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
        <Text color="#281A45" textAlign="center" fontSize="18px" fontWeight="500">
          Relacionados
        </Text>
      </Tabs>
    </Box>
  );
}
