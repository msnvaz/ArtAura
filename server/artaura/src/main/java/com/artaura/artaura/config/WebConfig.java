package com.artaura.artaura.config; // Update this to match your project structure

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from /uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");
        // If you need to serve other static folders, add them here (example for /public)
         registry.addResourceHandler("/public/**")
                 .addResourceLocations("file:" + System.getProperty("user.dir") + "/client/public/");
    }
}
