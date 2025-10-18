package com.artaura.artaura.security;

import com.artaura.artaura.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter { //runs once per request

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Skip JWT processing for public endpoints
        String requestPath = request.getRequestURI();
        if (isPublicEndpoint(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No JWT token found in request headers for protected endpoint: " + requestPath);
            filterChain.doFilter(request, response); // no token, proceed as anonymous
            return;
        }

        String token = authHeader.substring(7); // remove "Bearer "

        try {
            Jws<Claims> claimsJws = jwtUtil.validateToken(token);
            Claims claims = claimsJws.getBody();

            // Use subject as userId (you can parse if needed)
            String userId = claims.getSubject();
            if (userId == null) {
                Object userIdClaim = claims.get("userId");
                if (userIdClaim != null) {
                    userId = userIdClaim.toString();
                }
            }
            String role = claims.get("role", String.class);

            System.out.println("JWT validated successfully. UserId: " + userId + ", Role: " + role);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userId, null, Collections.singleton(authority));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid or expired JWT token: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired token");
            return; // stop filter chain and respond with 401
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Check if the request path is a public endpoint that doesn't require JWT authentication
     */
    private boolean isPublicEndpoint(String requestPath) {
        String[] publicPaths = {
            "/api/auth/login",
            "/api/auth/logout", 
            "/api/auth/verify",
            "/api/artist/signup",
            "/api/buyer/signup",
            "/api/shop/signup",
            "/uploads/",
            "/api/admin/payments/", // Allow admin payment endpoints for testing
            "/api/admin/artworks/", // Allow admin artwork endpoints for testing
            "/ws/" // Allow all websocket endpoints to be public
        };
        for (String publicPath : publicPaths) {
            if (requestPath.startsWith(publicPath)) {
                return true;
            }
        }
        return false;
    }
}
