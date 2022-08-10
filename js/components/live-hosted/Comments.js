import React, {forwardRef} from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { scale, getWindowWidth } from '../../platformUtils';
import { color } from '../../styles';
import Text, { SIZE, FONT_FAMILY } from '../common/Text';
const CommentsContainer = styled.View`
  background-color: ${color.transparent};
  width: ${getWindowWidth() * 0.7};
`;
const CommentText = styled(Text)`
  flex: 1;
`;
const CommentListContainer = styled.View`
  flex-direction: row;
  margin-vertical: ${scale(2)};
  justify-content: center;
`;
const CommenterProfileWrapper = styled.View`
  margin-left: ${scale(8)};
  width: ${scale(30)};
  height: ${scale(30)};
  border-radius: ${scale(30)};
`;
const CommenterProfile = styled.Image`
  width: ${scale(30)};
  height: ${scale(30)};
  border-radius: ${scale(30)};
`;
const CommenterName = styled(Text)`
  margin-horizontal: ${scale(12)};
`;
const Comments = ({ commentData }, ref) => {
  const CommentList = ({ image, name, commentText }) => {
    return (
      <CommentListContainer>
        <CommenterProfileWrapper>
          {image && <CommenterProfile source={{ uri: image }} resizeMode="cover" />}
        </CommenterProfileWrapper>
        <CommenterName fontFamily={FONT_FAMILY.SEMI_BOLD} size={SIZE.SMALL} color={color.white}>
          {name}
        </CommenterName>
        <CommentText fontFamily={FONT_FAMILY.MEDIUM} size={SIZE.XSMALL} color={color.white}>
          {commentText}
        </CommentText>
      </CommentListContainer>
    );
  };
  return (
    <CommentsContainer>
      <FlatList
        ref={ref}
        data={commentData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return <CommentList image={item?.profileImageURL} name={item?.username} commentText={item?.message} />;
        }}
      />
    </CommentsContainer>
  );
};

const CommentsForwardRef = forwardRef(Comments);

export default CommentsForwardRef;