package com.artaura.artaura.config; // Update this to match your project structure

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                                .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                                .allowedHeaders("*")
                                .allowCredentials(true)
                                .maxAge(3600);
        }

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // Serve uploaded product images
                registry.addResourceHandler("/uploads/products/**")
                                .addResourceLocations("file:uploads/products/");

                // Serve other uploads if needed
                registry.addResourceHandler("/uploads/**")
                                .addResourceLocations("file:uploads/");
        }
}
