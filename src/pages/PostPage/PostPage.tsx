import { Divider, Tag, Box, Text, Textarea, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { MdArrowUpward, MdMoreVert, MdEdit } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUserPost, fetchPostById, updateUserPost } from '../../service/Post';
import { UserPostById, UserPostInfo } from '../../interface/UserInterface';
import { UUID } from 'crypto';
import { DataText } from '../../components/DataText/DataText';
import { CreateComment } from '../../interface/CommentsInterface';
import { createUserComment } from '../../service/Comments';
import { CommentList } from '../../components/CommentList/CommentList';
import { FaTrash } from 'react-icons/fa';
import { usePostStore } from '../../store/postStore';


export function PostPage() {
  const { id } = useParams<{ id: string | UUID }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [post, setPost] = useState<UserPostById | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTags, setEditedTags] = useState<string>(''); 

  const getPost = async (id?: string | UUID) => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetchPostById(id);
      setPost(response);
      setEditedTitle(response.title); 
      setEditedDescription(response.description);
      setEditedTags(response.tags.join(', ')); 
    } catch (error) {
      console.error('Erro ao buscar post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async () => {
    if (!id || !post) return;
    const updatedPost: UserPostInfo = {
      ...post, 
      title: editedTitle, 
      description: editedDescription,
      tags: editedTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), 
    };

    try {
      await updateUserPost(id, updatedPost);
      toast({
        title: 'Post atualizado com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setIsModalOpen(false);
      getPost(id); 
      usePostStore.getState().updatePost(updatedPost); 
    } catch (error) {
      console.error('Erro ao editar post:', error);
    }
  };

  const handleDeletePost = async (id: string | UUID) => {
    try {
      await deleteUserPost(id);
      usePostStore.getState().removePost(id); 
      toast({
        title: 'Postagem excluída com sucesso!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir post:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === '' || !id) return;
  
    const newComment: CreateComment = {
      id: id,
      comment: commentText,
    };
  
    try {
      await createUserComment(id, newComment); 
      setCommentText(''); 
      await getPost(id); 
      usePostStore.getState().incrementCommentCount(id); 
  
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
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
        <Text color="#805AD5" fontSize="14px" fontWeight="500" lineHeight="20px">
          @{post.username}
        </Text>
        <Text fontSize="12px" fontWeight="500" color="#515151">
          <DataText created={post.created_at} updated={post.updated_at} sufix />
        </Text>
        <FaTrash onClick={() => id && handleDeletePost(id)} />
        <MdEdit style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => setIsModalOpen(true)} />
        <MdMoreVert style={{ marginLeft: '100px' }} />
        
      </Box>

      <Text mt="9px" color="#000" fontSize="16px" fontWeight="600">
        {post.title}
      </Text>

      <Box mt="8px" display="flex" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center">
          <MdArrowUpward style={{ width: '20px', height: '24px' }} />
          <Text fontSize="16px" fontWeight="600" color="#000">
            {post.score}
          </Text>
        </Box>
        <Text marginLeft="37px" mt="8px" color="#111" fontSize="14px" fontWeight="500">
          {post.description}
        </Text>
      </Box>

      <Box marginLeft="126px" mt="28px" display="flex">
        {post.tags.map((tag, index) => (
          <Tag key={index} size="md" variant="solid" colorScheme="purple" marginLeft={index > 0 ? '14px' : '0'}>
            {tag}
          </Tag>
        ))}
      </Box>

      <Box>
        <Divider mt="15px" background="#DEDEDE" height="1px" />
        <Text marginLeft="6px" mt="5px" color="#515151" fontSize="12px" fontWeight="500">
          {post.comment.length} comentário{post.comment.length !== 1 ? 's' : ''}
        </Text>
      </Box>

      <CommentList comments={post.comment} refreshComments={() => getPost(id)} /> 


      <Box mt="30px">
        <Text color="#281A45" fontSize="18px" fontWeight="500">
          Responder
        </Text>
        <Textarea
          borderRadius="6px"
          border="2px solid #805AD5"
          mt="21px"
          placeholder="Descreva sua resposta"
          width="320px"
          height="84px"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          padding="0px 24px"
          justifyContent="center"
          alignItems="center"
          mt="33px"
          size="lg"
          variant="solid"
          colorScheme="purple"
          width="320px"
          h="38px"
          onClick={handleCommentSubmit}
        >
          Responder
        </Button>
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Título do post"
              mb="16px"
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Descrição do post"
              mb="16px"
            />

            <Textarea
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)} 
              placeholder="Adicione tags separadas por vírgula"
              mb="16px"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button colorScheme="purple" onClick={handleEditPost}>
              Salvar alterações
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
