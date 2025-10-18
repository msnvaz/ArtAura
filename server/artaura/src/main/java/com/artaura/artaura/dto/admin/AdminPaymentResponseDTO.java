package com.artaura.artaura.dto.admin;

import java.util.List;

public class AdminPaymentResponseDTO {
    private List<AdminPaymentDTO> payments;
    private Long totalElements;
    private Integer totalPages;
    private Integer currentPage;
    private Integer pageSize;

    public AdminPaymentResponseDTO() {}

    public AdminPaymentResponseDTO(List<AdminPaymentDTO> payments, Long totalElements, 
                                  Integer totalPages, Integer currentPage, Integer pageSize) {
        this.payments = payments;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }

    // Getters and Setters
    public List<AdminPaymentDTO> getPayments() { return payments; }
    public void setPayments(List<AdminPaymentDTO> payments) { this.payments = payments; }

    public Long getTotalElements() { return totalElements; }
    public void setTotalElements(Long totalElements) { this.totalElements = totalElements; }

    public Integer getTotalPages() { return totalPages; }
    public void setTotalPages(Integer totalPages) { this.totalPages = totalPages; }

    public Integer getCurrentPage() { return currentPage; }
    public void setCurrentPage(Integer currentPage) { this.currentPage = currentPage; }

    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }
}