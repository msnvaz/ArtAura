package com.artaura.artaura.service.buyer;
import com.artaura.artaura.dto.buyer.OrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.artaura.artaura.dao.buyer.OrderDao;
import com.artaura.artaura.dto.buyer.AWOrderItemDto;
import com.artaura.artaura.dto.buyer.AWOrderDto;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderDao orderDao;

    public Long saveOrder(OrderRequest orderRequest) {
        return orderDao.saveOrder(orderRequest);
    }

    public List<AWOrderDto> getOrdersByBuyerId(Long buyerId) {
        return orderDao.getOrdersByBuyerId(buyerId);
    }
}
