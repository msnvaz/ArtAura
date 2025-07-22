package com.artaura.artaura.dao;

import com.artaura.artaura.dto.post.PostCreateDTO;
import com.artaura.artaura.dto.post.PostResponseDTO;
import com.artaura.artaura.dto.post.PostUpdateDTO;

import java.util.List;

public interface PostDAO {

    void savePost(Long userId, String role, PostCreateDTO postDTO);

    void deletePostById(Long postId);

    void updatePost(PostUpdateDTO postUpdateDTO);

    List<PostResponseDTO> getPostsByUser(String role, Long userId);

    PostResponseDTO getPostById(Long postId);
}
