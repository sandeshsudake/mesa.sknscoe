package com.sandeshsudake.MesaV2.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class loginController {

    @GetMapping("/login")
    public String loginPage(){
        return "login";
    }

    @GetMapping("/logicsuccess/")
    public String loginSuccess(HttpServletRequest request){

        // FIX: Check for the more specific role first
        if (request.isUserInRole("ROLE_ADMIN")){
            return "redirect:/admin";
        }
        else if (request.isUserInRole("ROLE_USER")){
            return "redirect:/user";
        }

        // This should not happen in normal circumstances
        return "redirect:/";
    }
}