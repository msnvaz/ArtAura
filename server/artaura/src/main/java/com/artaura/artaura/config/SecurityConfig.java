package com.artaura.artaura.config;

import com.artaura.artaura.security.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 🔁 CORS here
                .csrf(csrf -> csrf.disable()) // ❌ CSRF disabled for JWT stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 🚫 No
                // session
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/api/auth/login",
                        "/api/auth/logout",
                        "/api/auth/verify",
                        "/api/artist/signup",
                        "/api/buyer/signup",
                        "/api/shop/signup",
                        "/uploads/**", // <<< THIS ALLOWS IMAGE ACCESS
                        "/api/admin/artworks/**", // <<< TEMPORARY: Allow admin artwork endpoints for development
                        "/api/buyer/exhibitions/**",
                        "/api/users/**",
                        "/ws/**", // <-- Make sure this is present and permitted
                        "/api/posts/*/comments", // Allow GET access to comments without authentication
                        "/api/posts/*/like-status", // Allow GET access to like status without authentication
                        "/api/challenges/active", // Allow public access to view active challenges
                        "/api/shop/all", // Allow public access to discover shops
                        "/api/products" // Allow public access to discover products
                ).permitAll() // ✅ Public endpoints

                .requestMatchers("/api/posts/create").authenticated()
                .requestMatchers("/api/posts/{role}/{userId}").authenticated()// ✅ allow this
                .requestMatchers("/api/artist/artwork-orders/**").authenticated() // Artist artwork orders endpoints
                .anyRequest().authenticated() // 🔒 Everything else secured

                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // 🔐 JWT Filter

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Allow both common frontend ports
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        // Include PATCH method for order status updates
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*")); // Allow all headers including Authorization
        config.setAllowCredentials(true); // Allows sending cookies or Authorization headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Applies to all endpoints
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
