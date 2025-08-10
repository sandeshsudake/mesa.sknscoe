package com.sandeshsudake.MesaV2.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class loginController {

    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error, // Check for 'error' parameter
                            @RequestParam(value = "logout", required = false) String logout, // Check for 'logout' parameter
                            Model model) { // Pass Model to the method
        if (error != null) {
            // Add a flag to the model if there's a login error
            model.addAttribute("loginError", true);
            // You can also add a specific error message if Spring Security provides one
            // For example, if you configure AuthenticationFailureHandler, you can pass custom messages
            model.addAttribute("errorMessageText", "Invalid Username or Password. Please try again.");
        }

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