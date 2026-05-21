package com.ecommerce.order.entity;

import com.ecommerce.user.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalPrice;

    private String status = "PENDING";

    private String address;

    private String phone;

    private String customerName;
    @Column(columnDefinition = "TEXT")
    private String note;


    private LocalDateTime createdAt;

    @Column(unique = true, updatable = false)
    private String orderCode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderDetail> orderDetails;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
        if (this.orderCode == null) {
            String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            StringBuilder sb = new StringBuilder("ORD-");
            java.util.Random rnd = new java.util.Random();
            for (int i = 0; i < 8; i++) {
                sb.append(chars.charAt(rnd.nextInt(chars.length())));
            }
            this.orderCode = sb.toString();
        }
    }
}