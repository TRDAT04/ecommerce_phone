package com.ecommerce.product.service.command;

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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
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

    public ProductUpdateService(ProductRepository productRepository,
                                JsonParserService jsonParserService,
                                ProductCalculationService calculationService,
                                ProductDetailBuilder productDetailBuilder,
                                ProductBasicMapper basicMapper,
                                ProductSpecMapper specMapper,
                                ProductColorMapper colorMapper,
                                ProductVariantMapper variantMapper,
                                ProductImageAssembler productImageAssembler) {
        this.productRepository = productRepository;
        this.jsonParserService = jsonParserService;
        this.calculationService = calculationService;
        this.productDetailBuilder = productDetailBuilder;
        this.basicMapper = basicMapper;
        this.specMapper = specMapper;
        this.colorMapper = colorMapper;
        this.variantMapper = variantMapper;
        this.productImageAssembler = productImageAssembler;
    }

    public ProductDetailDTO updateProduct(Long id, UpdateProductDTO dto) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<VariantDTO> variants = jsonParserService.parseVariants(dto.getVariants());
        List<SpecDTO> specs = jsonParserService.parseSpecs(dto.getSpecifications());
        List<ColorDTO> colors = jsonParserService.parseColors(dto.getColors());

        basicMapper.mapBasic(product, dto.getName(), dto.getBrand());

        productImageAssembler.updateImage(product, dto.getImage(), dto.getBrand(), dto.getName());

        Map<String, ProductColor> colorMap = colorMapper.syncColors(product, colors);

        variantMapper.mapVariants(product, variants, colorMap);

        specMapper.mapSpecs(product, specs);

        calculationService.recalculate(product);

        product = productRepository.save(product);

        return productDetailBuilder.build(product);
    }
}