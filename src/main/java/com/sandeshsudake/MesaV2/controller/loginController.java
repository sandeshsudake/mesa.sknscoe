package com.sandeshsudake.MesaV2.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
    public String loginSuccess(HttpServletRequest request, RedirectAttributes redirectAttributes){ // Add RedirectAttributes

        if (request.isUserInRole("ROLE_ADMIN")){
            redirectAttributes.addFlashAttribute("loginSuccess", true); // Pass login success flag
            redirectAttributes.addFlashAttribute("loginMessage", "Welcome back, Admin!"); // Pass custom message
            return "redirect:/admin"; // Redirect to admin dashboard
        }
        else if (request.isUserInRole("ROLE_USER")){
            redirectAttributes.addFlashAttribute("loginSuccess", true); // Pass login success flag
            redirectAttributes.addFlashAttribute("loginMessage", "Welcome back!"); // Pass custom message
            return "redirect:/user"; // Redirect to user dashboard
        }

        // Fallback in case roles are not matched (should ideally not happen)
        return "redirect:/";
    }
}