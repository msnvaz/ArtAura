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
        // Get project root directory (parent of artaura folder)
        String currentDir = System.getProperty("user.dir");
        String projectRoot = currentDir.endsWith("artaura")
                ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                : currentDir + "/";

        // Serve uploaded files from client/public/uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");
        // If you need to serve other static folders, add them here (example for /public)
         registry.addResourceHandler("/public/**")
                 .addResourceLocations("file:" + System.getProperty("user.dir") + "/client/public/");
    }
}
