package com.ecommerce.product.service;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.dto.common.ColorDTO;
import com.ecommerce.product.dto.common.SpecDTO;
import com.ecommerce.product.dto.common.VariantDTO;
import com.ecommerce.product.dto.request.CreateProductDTO;
import com.ecommerce.product.dto.request.ProductFilterRequest;
import com.ecommerce.product.dto.request.UpdateProductDTO;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.dto.response.ProductHomeDTO;
import com.ecommerce.product.dto.response.ProductSuggestionDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductColor;
import com.ecommerce.product.mapper.ProductBasicMapper;
import com.ecommerce.product.mapper.ProductColorMapper;
import com.ecommerce.product.mapper.ProductSpecMapper;
import com.ecommerce.product.mapper.ProductVariantMapper;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.order.repository.OrderDetailRepository;
import com.ecommerce.product.service.helper.JsonParserService;
import com.ecommerce.product.service.helper.ProductCalculationService;
import com.ecommerce.product.service.helper.ProductDetailBuilder;
import com.ecommerce.product.service.helper.SlugService;
import com.ecommerce.product.service.image.ProductImageAssembler;
import com.ecommerce.product.spec.ProductSpecs;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final SlugService slugService;
    private final JsonParserService jsonParserService;
    private final ProductCalculationService calculationService;
    private final ProductDetailBuilder productDetailBuilder;
    private final ProductBasicMapper basicMapper;
    private final ProductSpecMapper specMapper;
    private final ProductColorMapper colorMapper;
    private final ProductVariantMapper variantMapper;
    private final ProductImageAssembler productImageAssembler;

    // ========================================================================
    // 1. QUERY METHODS (TÌM KIẾM & LẤY DỮ LIỆU)
    // ========================================================================

    public Page<ProductHomeDTO> getProducts(ProductFilterRequest filter) {
        Sort sort = buildSort(filter.getSort());
        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);
        Page<Product> products = productRepository.findAll(ProductSpecs.withFilter(filter), pageable);
        return products.map(basicMapper::toHomeDTO);
    }

    public List<ProductSuggestionDTO> suggestProducts(String keyword) {
        return productRepository.findTop8ByNameContainingIgnoreCaseOrderBySoldDesc(keyword)
                .stream()
                .map(p -> new ProductSuggestionDTO(p.getId(), p.getName(), p.getImageUrl(), p.getMinPrice()))
                .toList();
    }

    public List<String> getBrands() {
        return productRepository.findDistinctBrands();
    }

    public ProductDetailDTO getProductDetail(Long id) {
        Product product = findOrThrow(id);
        return productDetailBuilder.build(product);
    }

    // ========================================================================
    // 2. COMMAND METHODS (THÊM, SỬA, XÓA)
    // ========================================================================

    @Transactional
    public ProductDetailDTO createProduct(CreateProductDTO dto) {
        ParsedProductData parsed = parseInput(dto.getVariants(), dto.getSpecifications(), dto.getColors());
        String brandSlug = slugService.slugify(dto.getBrand());
        String productSlug = slugService.slugify(dto.getName());

        Product product = new Product();
        basicMapper.mapBasic(product, dto.getName(), dto.getBrand());
        productImageAssembler.handleAvatar(product, dto.getImage(), dto.getBrand(), dto.getName());

        // Save lần 1 để lấy ID
        product = productRepository.save(product);

        // Map các entity con sau khi có ID
        specMapper.mapSpecs(product, parsed.specs());
        Map<String, ProductColor> colorMap = colorMapper.mapColors(product, parsed.colors());
        variantMapper.mapVariants(product, parsed.variants(), colorMap);
        productImageAssembler.handleColorImages(dto, product, colorMap, brandSlug, productSlug);

        calculationService.recalculate(product);
        product = productRepository.save(product);

        return productDetailBuilder.build(product);
    }

    @Transactional
    public ProductDetailDTO updateProduct(Long id, UpdateProductDTO dto) {
        Product product = findOrThrow(id);
        ParsedProductData parsed = parseInput(dto.getVariants(), dto.getSpecifications(), dto.getColors());

        basicMapper.mapBasic(product, dto.getName(), dto.getBrand());
        productImageAssembler.updateImage(product, dto.getImage(), dto.getBrand(), dto.getName());
        
        Map<String, ProductColor> colorMap = colorMapper.syncColors(product, parsed.colors());
        variantMapper.mapVariants(product, parsed.variants(), colorMap);
        specMapper.mapSpecs(product, parsed.specs());

        calculationService.recalculate(product);
        product = productRepository.save(product);

        return productDetailBuilder.build(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findOrThrow(id);
        if (orderDetailRepository.existsByProductId(id)) {
            throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Không thể xóa sản phẩm đã có lịch sử đơn hàng");
        }
        productRepository.delete(product);
    }

    // ========================================================================
    // 3. PRIVATE HELPER METHODS (HÀM PHỤ TRỢ)
    // ========================================================================

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Product not found: " + id));
    }

    private ParsedProductData parseInput(String variantsJson, String specsJson, String colorsJson) {
        return new ParsedProductData(
                jsonParserService.parseVariants(variantsJson),
                jsonParserService.parseSpecs(specsJson),
                jsonParserService.parseColors(colorsJson)
        );
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

    private record ParsedProductData(
            List<VariantDTO> variants,
            List<SpecDTO> specs,
            List<ColorDTO> colors
    ) {}
}