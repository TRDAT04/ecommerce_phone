package com.ecommerce.product.service.command;

import com.ecommerce.product.dto.common.*;
import com.ecommerce.product.dto.request.CreateProductDTO;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.entity.*;
import com.ecommerce.product.mapper.*;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.service.helper.JsonParserService;
import com.ecommerce.product.service.helper.SlugService;
import com.ecommerce.product.service.helper.ProductCalculationService;
import com.ecommerce.product.service.image.ProductImageAssembler;
import com.ecommerce.product.service.query.ProductDetailBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductCreateService {

    private final ProductRepository productRepository;
    private final SlugService slugService;
    private final JsonParserService jsonParserService;
    private final ProductCalculationService calculationService;
    private final ProductDetailBuilder productDetailBuilder;
    private final ProductBasicMapper basicMapper;
    private final ProductSpecMapper specMapper;
    private final ProductColorMapper colorMapper;
    private final ProductVariantMapper variantMapper;
    private final ProductImageAssembler productImageAssembler;

    @Transactional
    public ProductDetailDTO createProduct(CreateProductDTO dto) {

        ParsedProductData parsed = parseInput(dto);
        // ④ Tính slug 1 lần, tái sử dụng
        String brandSlug = slugService.slugify(dto.getBrand());
        String productSlug = slugService.slugify(dto.getName());

        Product product = buildProduct(dto, parsed, brandSlug, productSlug);

        // ⑥ Save lần 1: cần ID để map children
        product = productRepository.save(product);

        // ⑦ Map các entity con sau khi có ID
        attachChildren(dto, product, parsed, brandSlug, productSlug);

        calculationService.recalculate(product);
        product = productRepository.save(product);

        return productDetailBuilder.build(product);
    }


    private ParsedProductData parseInput(CreateProductDTO dto) {
        return new ParsedProductData(
                jsonParserService.parseVariants(dto.getVariants()),
                jsonParserService.parseSpecs(dto.getSpecifications()),
                jsonParserService.parseColors(dto.getColors())
        );
    }

    private Product buildProduct(CreateProductDTO dto,
                                 ParsedProductData parsed,
                                 String brandSlug,
                                 String productSlug) {
        Product product = new Product();
        basicMapper.mapBasic(product, dto.getName(), dto.getBrand());
        productImageAssembler.handleAvatar(
                product, dto.getImage(), dto.getBrand(), dto.getName()
        );
        return product;
    }

    private void attachChildren(CreateProductDTO dto,
                                Product product,
                                ParsedProductData parsed,
                                String brandSlug,
                                String productSlug) {
        specMapper.mapSpecs(product, parsed.specs());
        Map<String, ProductColor> colorMap = colorMapper.mapColors(product, parsed.colors());
        variantMapper.mapVariants(product, parsed.variants(), colorMap);
        productImageAssembler.handleColorImages(dto, product, colorMap, brandSlug, productSlug);
    }

    // ─── Inner record ─────────────────────────────────────────────

    private record ParsedProductData(
            List<VariantDTO> variants,
            List<SpecDTO> specs,
            List<ColorDTO> colors
    ) {
    }
}