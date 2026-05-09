package com.ecommerce.product.mapper;

import com.ecommerce.product.dto.common.SpecDTO;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductSpecification;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductSpecMapper {

    public void mapSpecs(Product product, List<SpecDTO> specsDTO) {
        product.getSpecifications().clear();

        for (SpecDTO s : specsDTO) {
            ProductSpecification spec = new ProductSpecification();
            spec.setSpecKey(s.getSpecKey());
            spec.setSpecName(s.getSpecName());
            spec.setSpecValue(s.getSpecValue());
            spec.setProduct(product);

            product.getSpecifications().add(spec);
        }
    }
}