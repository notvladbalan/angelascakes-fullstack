package com.example.angelascakes.repository;

import com.example.angelascakes.entity.Order;
import com.example.angelascakes.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findBySeenFalse();
    List<Order> findByStatus(OrderStatus status);
}