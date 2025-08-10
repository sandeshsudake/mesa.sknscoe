package com.sandeshsudake.MesaV2.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class healthCheck {

    @GetMapping("/healthCheck")
    public String healthCheck(){
        return "ok";
    }
}
