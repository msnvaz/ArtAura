package com.artaura.artaura.config; // Update this to match your project structure

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get the current working directory and go up to the server directory
        String currentDir = System.getProperty("user.dir");
        String serverDir = currentDir.endsWith("artaura")
                ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                : currentDir + "/";

        String uploadPath = "file:" + serverDir + "uploads/";
        System.out.println("Serving static files from: " + uploadPath);

        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}
