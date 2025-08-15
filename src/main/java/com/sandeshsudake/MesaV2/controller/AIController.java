package com.sandeshsudake.MesaV2.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AIController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/api/ai-insights")
    public ResponseEntity<Map<String, String>> getAiInsights(@RequestBody Map<String, String> requestBody) {
        String prompt = requestBody.get("prompt");
        Map<String, String> response = new HashMap<>();

        if (prompt == null || prompt.trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "Prompt cannot be empty.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Map<String, Object> geminiRequestBody = new HashMap<>();
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));
            geminiRequestBody.put("contents", Collections.singletonList(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(geminiRequestBody, headers);

            // CRITICAL FIX: Changed model from gemini-pro to gemini-2.0-flash
            String geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;
            ResponseEntity<Map> geminiResponse = restTemplate.postForEntity(geminiApiUrl, entity, Map.class);

            if (geminiResponse.getStatusCode() == HttpStatus.OK && geminiResponse.getBody() != null) {
                Map<String, Object> geminiResponseBody = geminiResponse.getBody();
                if (geminiResponseBody.containsKey("candidates")) {
                    List<Map<String, Object>> candidates = (List<Map<String, Object>>) geminiResponseBody.get("candidates");
                    if (!candidates.isEmpty()) {
                        Map<String, Object> firstCandidate = candidates.get(0);
                        if (firstCandidate.containsKey("content")) {
                            Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
                            if (contentMap.containsKey("parts")) {
                                List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                                if (!parts.isEmpty()) {
                                    String generatedText = (String) parts.get(0).get("text");
                                    response.put("status", "success");
                                    response.put("response", generatedText);
                                    return ResponseEntity.ok(response);
                                }
                            }
                        }
                    }
                }
                response.put("status", "error");
                response.put("message", "AI response format unexpected.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

            } else {
                response.put("status", "error");
                response.put("message", "AI service returned an error: " + geminiResponse.getStatusCode());
                return ResponseEntity.status(geminiResponse.getStatusCode()).body(response);
            }

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error calling AI service: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}