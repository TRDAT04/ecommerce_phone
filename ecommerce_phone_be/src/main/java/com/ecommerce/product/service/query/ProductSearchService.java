package com.ecommerce.product.service.query;

import com.ecommerce.product.dto.response.ProductSuggestionDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.dto.request.ProductFilterRequest;
import com.ecommerce.product.dto.response.ProductHomeDTO;
import com.ecommerce.product.mapper.ProductBasicMapper;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.spec.ProductSpecs;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProductSearchService {

    private final ProductRepository productRepository;
    private final ProductBasicMapper basicMapper;

    public ProductSearchService(ProductRepository productRepository,
                                ProductBasicMapper basicMapper) {
        this.productRepository = productRepository;
        this.basicMapper = basicMapper;
    }

    public List<ProductSuggestionDTO> suggest(String keyword) {
        return productRepository
                .findTop8ByNameContainingIgnoreCaseOrderBySoldDesc(keyword)
                .stream()
                .map(p -> new ProductSuggestionDTO(
                        p.getId(),
                        p.getName(),
                        p.getImageUrl(),
                        p.getMinPrice()
                ))
                .toList();
    }

    public Page<ProductHomeDTO> search(ProductFilterRequest filter) {

        Sort sort = buildSort(filter.getSort());
        Pageable pageable = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                sort
        );

        Page<Product> products = productRepository.findAll(
                ProductSpecs.withFilter(filter),
                pageable
        );
        return products.map(basicMapper::toHomeDTO);
    }

    private Sort buildSort(String sort) {

        if (sort == null || sort.isBlank()) {
            return Sort.by("id").descending();
        }
        return switch (sort) {
            case "price_asc" -> Sort.by("minPrice").ascending();
            case "price_desc" -> Sort.by("minPrice").descending();
            case "rating" -> Sort.by("rating").descending();
            case "newest" -> Sort.by("id").descending();
            case "best_seller" -> Sort.by("sold").descending();
            case "featured" -> Sort.by("priority").descending();
            default -> Sort.by("id").descending();
        };
    }
}