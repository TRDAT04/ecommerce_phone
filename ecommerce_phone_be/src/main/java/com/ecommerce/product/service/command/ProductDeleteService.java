package com.ecommerce.product.service.command;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductDeleteService {

    private final ProductRepository productRepository;
    private final com.ecommerce.order.repository.OrderDetailRepository orderDetailRepository;

    public ProductDeleteService(ProductRepository productRepository, com.ecommerce.order.repository.OrderDetailRepository orderDetailRepository) {
        this.productRepository = productRepository;
        this.orderDetailRepository = orderDetailRepository;
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found " + id));

        if (orderDetailRepository.existsByProductId(id)) {
            throw new AppException("Không thể xóa sản phẩm đã có lịch sử đơn hàng");
        }

        productRepository.delete(product);
    }
}