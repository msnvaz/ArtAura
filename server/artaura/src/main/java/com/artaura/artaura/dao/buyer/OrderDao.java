package com.artaura.artaura.dao.buyer;
import com.artaura.artaura.dto.buyer.AWOrderDto;
import com.artaura.artaura.dto.buyer.AWOrderItemDto; // Each AWOrderDto contains a list of AWOrderItemDto
import com.artaura.artaura.dto.buyer.OrderRequest;
import java.util.List;

public interface OrderDao {
    Long saveOrder(OrderRequest orderRequest);
    /**
     * Returns a list of AWOrderDto, each containing a list of AWOrderItemDto representing order items.
     */
    List<AWOrderDto> getOrdersByBuyerId(Long buyerId);
}
