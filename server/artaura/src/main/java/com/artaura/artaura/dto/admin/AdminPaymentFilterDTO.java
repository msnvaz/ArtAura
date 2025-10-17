package com.artaura.artaura.dto.admin;

public class AdminPaymentFilterDTO {
    private String status;
    private String paymentType;
    private Long artistId;
    private Long buyerId;
    private String sortBy;
    private String sortOrder;
    private Integer page;
    private Integer size;

    public AdminPaymentFilterDTO() {}

    public AdminPaymentFilterDTO(String status, String paymentType, Long artistId, Long buyerId,
                                String sortBy, String sortOrder, Integer page, Integer size) {
        this.status = status;
        this.paymentType = paymentType;
        this.artistId = artistId;
        this.buyerId = buyerId;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.page = page;
        this.size = size;
    }

    // Getters and Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }

    public String getSortOrder() { return sortOrder; }
    public void setSortOrder(String sortOrder) { this.sortOrder = sortOrder; }

    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }

    public Integer getSize() { return size; }
    public void setSize(Integer size) { this.size = size; }
}