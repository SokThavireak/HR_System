package com.hrms.config;

import org.springframework.context.annotation.*;
import org.springframework.web.cors.*;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var config = new CorsConfiguration();
        String envOrigins = System.getenv("ALLOWED_ORIGINS");
        java.util.List<String> origins = new java.util.ArrayList<>();
        origins.add("http://localhost:3000");
        origins.add("http://localhost:5173");
        origins.add("https://*.onrender.com");
        if (envOrigins != null && !envOrigins.isEmpty()) {
            for (String origin : envOrigins.split(",")) {
                if (!origin.trim().isEmpty()) {
                    origins.add(origin.trim());
                }
            }
        }
        config.setAllowedOriginPatterns(origins);
        config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(java.util.List.of("Authorization"));
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
