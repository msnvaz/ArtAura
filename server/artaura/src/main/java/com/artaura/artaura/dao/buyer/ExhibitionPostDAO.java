package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.exhibition.ExhibitionPostDTO;

import java.util.List;

public interface ExhibitionPostDAO {
    int save(ExhibitionPostDTO post);
    List<ExhibitionPostDTO> getAllExhibitions();
}
