package com.ecommerce.product.service.command;

import com.ecommerce.common.exception.AppException;
import org.springframework.http.HttpStatus;
import com.ecommerce.product.dto.common.*;
import com.ecommerce.product.dto.request.UpdateProductDTO;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.entity.*;
import com.ecommerce.product.mapper.*;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.service.helper.JsonParserService;
import com.ecommerce.product.service.helper.ProductCalculationService;
import com.ecommerce.product.service.image.ProductImageAssembler;
import com.ecommerce.product.service.query.ProductDetailBuilder;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductUpdateService {

    private final ProductRepository productRepository;
    private final JsonParserService jsonParserService;
    private final ProductCalculationService calculationService;
    private final ProductDetailBuilder productDetailBuilder;
    private final ProductBasicMapper basicMapper;
    private final ProductSpecMapper specMapper;
    private final ProductColorMapper colorMapper;
    private final ProductVariantMapper variantMapper;
    private final ProductImageAssembler productImageAssembler;

    public ProductDetailDTO updateProduct(Long id, UpdateProductDTO dto) {

        Product product = findOrThrow(id);
        ParsedProductData parsed = parseInput(dto);
        applyUpdates(product, dto, parsed);

        calculationService.recalculate(product);
        product = productRepository.save(product);

        return productDetailBuilder.build(product);
    }

    // ─── Private helpers ──────────────────────────────────────────

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Product not found: " + id));

    }

    private ParsedProductData parseInput(UpdateProductDTO dto) {
        return new ParsedProductData(
                jsonParserService.parseVariants(dto.getVariants()),
                jsonParserService.parseSpecs(dto.getSpecifications()),
                jsonParserService.parseColors(dto.getColors())
        );
    }

    private void applyUpdates(Product product,
                              UpdateProductDTO dto,
                              ParsedProductData parsed) {
        basicMapper.mapBasic(product, dto.getName(), dto.getBrand());
        productImageAssembler.updateImage(
                product, dto.getImage(), dto.getBrand(), dto.getName()
        );
        Map<String, ProductColor> colorMap =
                colorMapper.syncColors(product, parsed.colors());
        variantMapper.mapVariants(product, parsed.variants(), colorMap);
        specMapper.mapSpecs(product, parsed.specs());
    }


    private record ParsedProductData(
            List<VariantDTO> variants,
            List<SpecDTO> specs,
            List<ColorDTO> colors
    ) {
    }
}