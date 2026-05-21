package com.example.angelascakes.service;

import com.example.angelascakes.dto.*;
import com.example.angelascakes.entity.*;
import com.example.angelascakes.exception.ResourceNotFoundException;
import com.example.angelascakes.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CakeRepository cakeRepository;
    private final CakeSizeRepository cakeSizeRepository;

    @Transactional
    public OrderResponseDTO placeOrder(String userEmail, OrderRequestDTO dto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen."));

        Order order = new Order();
        order.setUser(user);
        order.setNote(dto.getNote());

        // Copy delivery address from user
        order.setDeliveryFirstName(user.getFirstName());
        order.setDeliveryLastName(user.getLastName());
        order.setDeliveryAddressLine(user.getAddressLine());
        order.setDeliveryBuildingName(user.getBuildingName());
        order.setDeliveryStreetName(user.getStreetName());
        order.setDeliveryPostcode(user.getPostcode());
        order.setDeliveryCity(user.getCity());

        // Build order items
        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = dto.getItems().stream().map(itemDTO -> {
            Cake cake = cakeRepository.findById(itemDTO.getCakeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dort nenalezen."));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setCake(cake);
            item.setQuantity(itemDTO.getQuantity());

            // Set size if provided
            if (itemDTO.getCakeSizeId() != null) {
                CakeSize size = cakeSizeRepository.findById(itemDTO.getCakeSizeId())
                        .orElseThrow(() -> new ResourceNotFoundException("Velikost nenalezena."));
                item.setCakeSize(size);
                item.setPriceAtOrder(size.getPrice());
            } else {
                item.setPriceAtOrder(cake.getPrice());
            }

            return item;
        }).collect(Collectors.toList());

        // Calculate total
        BigDecimal orderTotal = items.stream()
                .map(item -> item.getPriceAtOrder()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(items);
        order.setTotalPrice(orderTotal);

        Order saved = orderRepository.save(order);
        log.info("Nová objednávka vytvořena, id: {}", saved.getId());
        return toDTO(saved);
    }

    public List<OrderResponseDTO> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen."));
        return orderRepository.findByUserId(user.getId())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getMyOrderById(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen."));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Objednávka nenalezena."));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Přístup odepřen.");
        }

        return toDTO(order);
    }

    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponseDTO updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Objednávka nenalezena."));

        order.setStatus(OrderStatus.valueOf(status));
        order.setSeen(true);
        Order saved = orderRepository.save(order);
        log.info("Status objednávky {} změněn na {}", orderId, status);
        return toDTO(saved);
    }

    public OrderResponseDTO cancelOrder(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen."));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Objednávka nenalezena."));

        // Check order belongs to this user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Přístup odepřen.");
        }

        // Only allow cancel if PENDING or IN_PROGRESS
        if (order.getStatus() == OrderStatus.SHIPPED ||
                order.getStatus() == OrderStatus.DELIVERED ||
                order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Objednávku nelze zrušit ve stavu: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);
        log.info("Objednávka zrušena zákazníkem, id: {}", orderId);
        return toDTO(saved);
    }

    @Transactional
    public void markAsSeen(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Objednávka nenalezena."));
        order.setSeen(true);
        orderRepository.save(order);
    }

    public long countUnseenOrders() {
        return orderRepository.findBySeenFalse().size();
    }

    public OrderResponseDTO getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Objednávka nenalezena."));
        return toDTO(order);
    }

    private OrderResponseDTO toDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setCustomerEmail(order.getUser().getEmail());
        dto.setStatus(order.getStatus().name());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setNote(order.getNote());
        dto.setSeen(order.isSeen());
        dto.setDeliveryFirstName(order.getDeliveryFirstName());
        dto.setDeliveryLastName(order.getDeliveryLastName());
        dto.setDeliveryAddressLine(order.getDeliveryAddressLine());
        dto.setDeliveryBuildingName(order.getDeliveryBuildingName());
        dto.setDeliveryStreetName(order.getDeliveryStreetName());
        dto.setDeliveryPostcode(order.getDeliveryPostcode());
        dto.setDeliveryCity(order.getDeliveryCity());

        dto.setItems(order.getItems().stream().map(item -> {
            OrderItemResponseDTO itemDTO = new OrderItemResponseDTO();
            itemDTO.setId(item.getId());
            itemDTO.setCakeId(item.getCake().getId());
            itemDTO.setCakeName(item.getCake().getName());
            itemDTO.setCakeImageUrl(item.getCake().getImageUrl());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setPriceAtOrder(item.getPriceAtOrder());
            itemDTO.setTotalPrice(item.getPriceAtOrder()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));

            if (item.getCakeSize() != null) {
                itemDTO.setSizeLabel(item.getCakeSize().getLabel());
                itemDTO.setSlices(item.getCakeSize().getSlices());
            }

            return itemDTO;
        }).collect(Collectors.toList()));

        return dto;
    }
}