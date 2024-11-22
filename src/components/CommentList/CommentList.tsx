import { Box, Text, Divider, Textarea, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { MdArrowUpward, MdEdit, MdMoreVert } from 'react-icons/md';
import { DataText } from '../DataText/DataText';
import { useState } from 'react';
import { Comment, UpdateComment } from '../../interface/CommentsInterface';
import { FaTrash } from 'react-icons/fa';
import { useCommentStore } from '../../store/commentStore';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';

interface CommentListProps {
  comments: Comment[];
  refreshComments: () => void;
}

export function CommentList({ comments, refreshComments }: CommentListProps) {
  const [editedCommentId, setEditedCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUserId = useAuthStore((state) => state.id);
  const role = useProfileStore((state) => state.role)

  const { removeComment, updateComment } = useCommentStore();

  const handleEditComment = async (commentId: string, commentText: string) => {
    setEditedCommentId(commentId);
    setEditedCommentText(commentText);
    setIsModalOpen(true); 
  };

 
  const handleSaveComment = async () => {
    if (!editedCommentText.trim()) return; 

    const updatedComment: UpdateComment = {
      id: editedCommentId as string, 
      comment: editedCommentText,
    };

    try {
      await updateComment(updatedComment);
      setIsModalOpen(false); 
      setEditedCommentText(''); 
      refreshComments(); 
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {

      await removeComment(commentId);
      refreshComments(); 
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
    }
  };
  
  return (
    <>
      {comments.map((comment) => (
        <Box key={comment.id} mt="20px">
          <MdMoreVert style={{ marginTop: '20px', marginLeft: '328px' }} />
          <Box mt="8px" display="flex" alignItems="center">
            <Box marginLeft="30px" display="flex" flexDirection="column" alignItems="center">
              <MdArrowUpward style={{ width: '20px', height: '24px' }} />
              <Text fontSize="16px" fontWeight="600" color="#000">
                {comment.score}
              </Text>
            </Box>
            <Text marginLeft="26px" mt="8px" color="#111" fontSize="14px" fontWeight="400">
              {comment.comment}
            </Text>
          </Box>
          <Text mt="14px" paddingLeft="278px" color="#515151" fontSize="12px" fontWeight="500" lineHeight="20px">
            <DataText created={comment.created_at} updated={comment.updated_at} sufix />
          </Text>
          <Text color="#805AD5" paddingLeft="274px" fontSize="12px" fontWeight="500" lineHeight="20px">
            @{comment.username}
          </Text>
          <Box display="flex" justifyContent="space-between" paddingLeft="274px" mt="10px">
            {(currentUserId == comment.user_id  || role === "ADMIN") && (

              <> 
              <MdEdit onClick={() => handleEditComment(comment.id, comment.comment)} />
              <FaTrash onClick={() => handleDeleteComment(comment.id)} />     
              </>
            )}
          </Box>
          <Divider mt="15px" background="#DEDEDE" height="1px" mx="auto" maxWidth="85%" />
        </Box>
      ))}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Comentário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={editedCommentText}
              onChange={(e) => setEditedCommentText(e.target.value)}
              size="sm"
              mb="10px"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveComment}>
              Salvar
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
