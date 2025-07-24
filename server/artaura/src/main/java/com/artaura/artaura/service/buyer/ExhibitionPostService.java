package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.ExhibitionPostDAO;
import com.artaura.artaura.dto.exhibition.ExhibitionPostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExhibitionPostService {

    @Autowired
    private ExhibitionPostDAO exhibitionPostDAO;

    public void saveExhibition(ExhibitionPostDTO post, Long userId) {
        post.setCreatedBy(userId);
        post.setCreatedAt(java.time.LocalDateTime.now().toString());
        exhibitionPostDAO.save(post);
    }

    public List<ExhibitionPostDTO> getAllExhibitions() {
        return exhibitionPostDAO.getAllExhibitions();
    }
}