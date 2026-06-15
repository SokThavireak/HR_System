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
        if (envOrigins != null && !envOrigins.isEmpty()) {
            config.setAllowedOrigins(java.util.Arrays.asList(envOrigins.split(",")));
        } else {
            config.setAllowedOriginPatterns(java.util.List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://*.onrender.com"
            ));
        }
        config.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(java.util.List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(java.util.List.of("Authorization"));
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
