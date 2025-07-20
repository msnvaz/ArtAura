package com.artaura.artaura.dto;

import java.util.List;

public class ResponseDTO<T> {
    private List<T> content;
    private Integer currentPage;
    private Integer totalPages;
    private Long totalElements;
    private Integer pageSize;

    public ResponseDTO() {}

    public ResponseDTO(List<T> content, Integer currentPage, 
                      Integer totalPages, Long totalElements, Integer pageSize) {
        this.content = content;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.pageSize = pageSize;
    }

    // Getters and Setters
    public List<T> getContent() { return content; }
    public void setContent(List<T> content) { this.content = content; }

    public Integer getCurrentPage() { return currentPage; }
    public void setCurrentPage(Integer currentPage) { this.currentPage = currentPage; }

    public Integer getTotalPages() { return totalPages; }
    public void setTotalPages(Integer totalPages) { this.totalPages = totalPages; }

    public Long getTotalElements() { return totalElements; }
    public void setTotalElements(Long totalElements) { this.totalElements = totalElements; }

    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }
}
