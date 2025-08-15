package com.artaura.artaura.dao.buyer;
import com.artaura.artaura.dto.buyer.OrderRequest;
public interface OrderDao {
    Long saveOrder(OrderRequest orderRequest);
}
