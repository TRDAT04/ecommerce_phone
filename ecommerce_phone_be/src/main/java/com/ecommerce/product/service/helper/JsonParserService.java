package com.ecommerce.product.service.helper;

import com.ecommerce.common.exception.AppException;
import com.ecommerce.product.dto.common.ColorDTO;
import com.ecommerce.product.dto.common.SpecDTO;
import com.ecommerce.product.dto.common.VariantDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class JsonParserService {

    private final ObjectMapper mapper = new ObjectMapper();

    public List<VariantDTO> parseVariants(String json) {

        try {
            return mapper.readValue(
                    json,
                    mapper.getTypeFactory()
                            .constructCollectionType(List.class, VariantDTO.class)
            );

        } catch (IOException e) {
            throw new AppException("Invalid variants data");
        }
    }

    public List<SpecDTO> parseSpecs(String json) {

        try {
            return mapper.readValue(
                    json,
                    mapper.getTypeFactory()
                            .constructCollectionType(List.class, SpecDTO.class)
            );

        } catch (IOException e) {
            throw new AppException("Invalid specifications data");
        }
    }

    public List<ColorDTO> parseColors(String json) {

        try {

            if (json == null || json.isBlank()) {
                return new ArrayList<>();
            }

            return mapper.readValue(
                    json,
                    mapper.getTypeFactory()
                            .constructCollectionType(List.class, ColorDTO.class)
            );

        } catch (IOException e) {
            throw new AppException("Invalid colors data");
        }
    }
}