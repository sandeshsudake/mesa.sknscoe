package com.sandeshsudake.MesaV2.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class mySecurityConfig {

    @Autowired
    MyUserDetailService myUserDetailService;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        // --- PUBLIC ACCESS: Permit all public-facing endpoints and static resources ---
                        .requestMatchers(
                                // Core public pages
                                "/", "/index.html", "/home/**","/error", "/error.html",

                                // Static Resources (CSS, JS, etc.)
                                "/css/**", "/js/**", "/static/**", "/assets/**", "/webjars/**", "/favicon.ico",

                                // Image folders
                                "/mesa-logo/**", "/slider-img/**",
                                "/mesa-team/**",   // <-- CRITICAL FIX: Added team images
                                "/gallery-img/**",   // <-- CRITICAL FIX: Added gallery images
                                "/seminar-img/**",   // <-- CRITICAL FIX: Added seminar images
                                "/best-outgoing-stud/**",   // <-- CRITICAL FIX: Added best otg stud images

                                // Health Check & general forms
                                "/healthCheck", "/addFRF",
                                "/api/ai-insights"               // <-- CRITICAL FIX: Permit access to AI API endpoint
                        ).permitAll()
                        // --- PUBLIC ACCESS (Method Specific): Permit specific HTTP methods for user registration ---
                        .requestMatchers(HttpMethod.GET, "/userRegForm").permitAll()
                        .requestMatchers(HttpMethod.POST, "/addNewUser").permitAll()
                        .requestMatchers(HttpMethod.POST, "/registerEvent/**").permitAll()

                        // --- ROLE-BASED ACCESS: Restrict paths based on user roles ---
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // FIX: Added a new rule to secure the report pages for Admins only
                        .requestMatchers("/report/**").hasRole("ADMIN")
                        .requestMatchers("/user/**").hasRole("USER")

                        // --- DEFAULT RULE: All other requests must be authenticated ---
                        .anyRequest().authenticated()
                )
                // --- LOGIN CONFIGURATION ---
                .formLogin(login -> login
                        .loginPage("/login")             // Your custom login page URL
                        .loginProcessingUrl("/login")    // The URL to process the login credentials
                        .defaultSuccessUrl("/logicsuccess/", true) // Redirect on successful login
                        .permitAll()                     // Allow everyone to access the login page
                )
                // --- REMEMBER ME CONFIGURATION ---
                .rememberMe(rememberMe -> rememberMe
                        .tokenValiditySeconds(60 * 10)   // Token is valid for 10 minutes
                )
                // --- LOGOUT CONFIGURATION ---
                .logout(logout -> logout
                        .logoutSuccessUrl("/")           // Redirect to home page after logout
                        .permitAll()                     // Allow everyone to access logout
                );
        return http.build();
    }

    @Bean
    PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(getPasswordEncoder());
        provider.setUserDetailsService(myUserDetailService);
        return provider;
    }
}

