package com.sandeshsudake.MesaV2.config;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate; // Import RestTemplate

@Configuration
public class GeminiConfig {

    // Corrected placeholder to use dot notation: gemini.api.key
    @Value("${gemini.api.key}")
    private String apiKey;

    @Bean
    public Client geminiClient() {
        // Your existing hypothetical constructor for Client
        // Note: This 'Client' might not be the standard Google Gemini Java client library.
        // If you intend to use Google's official client library, the setup might differ.
        return new Client();
    }

    @Bean // Define RestTemplate as a Spring Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}