package com.artaura.artaura.dto.admin;

import java.util.List;

public class AdminArtworkResponseDTO {

    private List<AdminArtworkDTO> artworks;
    private Integer currentPage;
    private Integer totalPages;
    private Long totalElements;
    private Integer pageSize;

    public AdminArtworkResponseDTO() {
    }

    public AdminArtworkResponseDTO(List<AdminArtworkDTO> artworks, Integer currentPage,
            Integer totalPages, Long totalElements, Integer pageSize) {
        this.artworks = artworks;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.pageSize = pageSize;
    }

    // Getters and Setters
    public List<AdminArtworkDTO> getArtworks() {
        return artworks;
    }

    public void setArtworks(List<AdminArtworkDTO> artworks) {
        this.artworks = artworks;
    }

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public Long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}
