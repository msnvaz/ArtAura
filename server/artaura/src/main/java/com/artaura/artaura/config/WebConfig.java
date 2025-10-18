package com.artaura.artaura.config; // Update this to match your project structure

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get project root directory (parent of artaura folder)
        String currentDir = System.getProperty("user.dir");
        String projectRoot = currentDir.endsWith("artaura")
                ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                : currentDir + "/";

        // Serve uploaded files from client/public/uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + projectRoot + "client/public/uploads/");

        // Serve static files from client/public
        registry.addResourceHandler("/public/**")
                .addResourceLocations("file:" + projectRoot + "client/public/");
    }
}
