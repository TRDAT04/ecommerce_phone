package com.ecommerce.product.service.query;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductDetailService Tests")
class ProductDetailServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductDetailBuilder productDetailBuilder;

    @InjectMocks
    private ProductDetailService productDetailService;

    private Product mockProduct;

    @BeforeEach
    void setUp() {
        mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("iPhone 15 Pro");
        mockProduct.setBrand("Apple");
    }

    // ===== getProductDetail =====

    @Test
    @DisplayName("getProductDetail: id tồn tại → trả về ProductDetailDTO đúng")
    void getProductDetail_withExistingId_shouldReturnDTO() {
        ProductDetailDTO expectedDTO = new ProductDetailDTO();
        expectedDTO.setId(1L);
        expectedDTO.setName("iPhone 15 Pro");
        expectedDTO.setBrand("Apple");

        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(productDetailBuilder.build(mockProduct)).thenReturn(expectedDTO);

        ProductDetailDTO result = productDetailService.getProductDetail(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("iPhone 15 Pro");
        assertThat(result.getBrand()).isEqualTo("Apple");

        verify(productRepository).findById(1L);
        verify(productDetailBuilder).build(mockProduct);
    }

    @Test
    @DisplayName("getProductDetail: id không tồn tại → throw AppException 404")
    void getProductDetail_withNonExistingId_shouldThrowAppException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productDetailService.getProductDetail(999L))
                .isInstanceOf(AppException.class)
                .hasMessageContaining("Product not found")
                .satisfies(ex -> assertThat(((AppException) ex).getStatus()).isEqualTo(HttpStatus.NOT_FOUND));

        verify(productDetailBuilder, never()).build(any());
    }

    // ===== getBrands =====

    @Test
    @DisplayName("getBrands: trả về danh sách brands từ repository")
    void getBrands_shouldReturnListFromRepository() {
        List<String> expectedBrands = List.of("Apple", "Samsung", "Xiaomi");
        when(productRepository.findDistinctBrands()).thenReturn(expectedBrands);

        List<String> result = productDetailService.getBrands();

        assertThat(result).isNotNull();
        assertThat(result).hasSize(3);
        assertThat(result).containsExactlyInAnyOrder("Apple", "Samsung", "Xiaomi");

        verify(productRepository).findDistinctBrands();
    }
}
