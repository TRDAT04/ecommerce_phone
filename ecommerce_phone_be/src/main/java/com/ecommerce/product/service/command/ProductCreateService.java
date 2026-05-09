package com.ecommerce.product.service.command;

import com.ecommerce.product.dto.common.*;
import com.ecommerce.product.dto.request.CreateProductDTO;
import com.ecommerce.product.dto.response.ProductDetailDTO;
import com.ecommerce.product.entity.*;
import com.ecommerce.product.mapper.*;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.service.helper.JsonParserService;
import com.ecommerce.product.service.helper.SlugService;
import com.ecommerce.product.service.business.ProductCalculationService;
import com.ecommerce.product.service.image.ProductImageAssembler;
import com.ecommerce.product.service.query.ProductDetailBuilder;
import com.ecommerce.product.service.image.ProductImageService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
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

    public ProductCreateService(
            ProductRepository productRepository,
            SlugService slugService,
            JsonParserService jsonParserService,
            ProductCalculationService calculationService,
            ProductImageService productImageService,
            ProductDetailBuilder productDetailBuilder,
            ProductBasicMapper basicMapper,
            ProductSpecMapper specMapper,
            ProductColorMapper colorMapper,
            ProductVariantMapper variantMapper,
            ProductImageAssembler productImageAssembler) {

        this.productRepository = productRepository;
        this.slugService = slugService;
        this.jsonParserService = jsonParserService;
        this.calculationService = calculationService;
        this.productDetailBuilder = productDetailBuilder;
        this.basicMapper = basicMapper;
        this.specMapper = specMapper;
        this.colorMapper = colorMapper;
        this.variantMapper = variantMapper;
        this.productImageAssembler = productImageAssembler;
    }

    public ProductDetailDTO createProduct(CreateProductDTO dto) {

        List<VariantDTO> variants = jsonParserService.parseVariants(dto.getVariants());
        List<SpecDTO> specs = jsonParserService.parseSpecs(dto.getSpecifications());
        List<ColorDTO> colors = jsonParserService.parseColors(dto.getColors());

        Product product = new Product();
        basicMapper.mapBasic(product, dto.getName(), dto.getBrand());

        String brandSlug = slugService.slugify(dto.getBrand());
        String productSlug = slugService.slugify(dto.getName());

        productImageAssembler.handleAvatar(product, dto.getImage(), dto.getBrand(), dto.getName());

        product = productRepository.save(product);

        specMapper.mapSpecs(product, specs);

        Map<String, ProductColor> colorMap = colorMapper.mapColors(product, colors);

        variantMapper.mapVariants(product, variants, colorMap);

        productImageAssembler.handleColorImages(dto, product, colorMap, brandSlug, productSlug);

        calculationService.recalculate(product);

        product = productRepository.save(product);

        return productDetailBuilder.build(product);
    }
}