package com.artaura.artaura.service.buyer;
import com.artaura.artaura.dto.buyer.OrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.artaura.artaura.dao.buyer.OrderDao;

@Service
public class OrderService {
    @Autowired
    private OrderDao orderDao;

    public Long saveOrder(OrderRequest orderRequest) {
        return orderDao.saveOrder(orderRequest);
    }
}
