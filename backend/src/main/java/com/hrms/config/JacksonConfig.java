package com.hrms.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer hibernateJacksonCustomizer() {
        return builder -> {
            Hibernate6Module module = new Hibernate6Module();
            module.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, false);
            module.configure(Hibernate6Module.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS, true);
            builder.modules(module, new JavaTimeModule());
        };
    }
}
