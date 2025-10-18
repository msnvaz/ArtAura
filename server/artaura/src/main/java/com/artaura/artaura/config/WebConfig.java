package com.artaura.artaura.config; // Update this to match your project structure

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        try {
            // Get project root directory - use absolute path for reliability
            String currentDir = System.getProperty("user.dir");
            System.out.println("🔧 Current working directory: " + currentDir);

            // For this specific project structure: ArtAura2/server/artaura
            // We need to go up to ArtAura2 level
            String projectRoot;
            if (currentDir.contains("ArtAura2")) {
                // Extract everything up to and including ArtAura2
                int artAuraIndex = currentDir.indexOf("ArtAura2");
                projectRoot = currentDir.substring(0, artAuraIndex + 8) + System.getProperty("file.separator"); // 8 is length of "ArtAura2"
            } else {
                // Fallback to current directory
                projectRoot = currentDir + System.getProperty("file.separator");
            }

            String uploadsPath = projectRoot + "client" + System.getProperty("file.separator") + "public" + System.getProperty("file.separator") + "uploads" + System.getProperty("file.separator");
            String publicPath = projectRoot + "client" + System.getProperty("file.separator") + "public" + System.getProperty("file.separator");

            System.out.println("🔧 Project root: " + projectRoot);
            System.out.println("🔧 Uploads path: " + uploadsPath);
            System.out.println("🔧 Public path: " + publicPath);

            // Verify paths exist
            java.io.File uploadsDir = new java.io.File(uploadsPath);
            java.io.File publicDir = new java.io.File(publicPath);
            System.out.println("🔧 Uploads directory exists: " + uploadsDir.exists());
            System.out.println("🔧 Public directory exists: " + publicDir.exists());

            // Serve uploaded files from client/public/uploads
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:" + uploadsPath);

            // Serve static files from client/public
            registry.addResourceHandler("/public/**")
                    .addResourceLocations("file:" + publicPath);

        } catch (Exception e) {
            System.err.println("❌ Error configuring resource handlers: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
