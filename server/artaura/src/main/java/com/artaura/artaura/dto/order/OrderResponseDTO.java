package com.artaura.artaura.dto.order;

public class OrderResponseDTO {

    private String message;
    private Object data;
    private boolean success;

    public OrderResponseDTO() {
    }

    public OrderResponseDTO(String message, Object data) {
        this.message = message;
        this.data = data;
        this.success = true;
    }

    public OrderResponseDTO(String message, Object data, boolean success) {
        this.message = message;
        this.data = data;
        this.success = success;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
