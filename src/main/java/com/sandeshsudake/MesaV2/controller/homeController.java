package com.sandeshsudake.MesaV2.controller;

import com.sandeshsudake.MesaV2.entity.Event;
import com.sandeshsudake.MesaV2.entity.FRF;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.sandeshsudake.MesaV2.repository.eventRepo;
import com.sandeshsudake.MesaV2.repository.frfRepo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.UUID;

@Controller
public class homeController {

    @Autowired
    eventRepo eventRepo;

    @Autowired
    frfRepo frfRepo;

    @GetMapping("")
    public String homePage(Model model, HttpSession session){

        List<Event> events = eventRepo.findAll();
        model.addAttribute("events",events);

        return "index";
    }

    @GetMapping("/userRegForm")
    public String showRegForm(){
        return "register";

    }

    @PostMapping("/addFRF")
    public String addFRF(FRF frf, RedirectAttributes redirectAttributes){
        // Manually set a unique ID if it's not already present
        if (frf.getFrfId() == null || frf.getFrfId().isEmpty()) {
            frf.setFrfId(UUID.randomUUID().toString());
        }
        frfRepo.save(frf);

        // Use addFlashAttribute to make a message available after redirect
        // The key "frfSuccessMessage" will be available in the model of the redirected page.
        redirectAttributes.addFlashAttribute("frfSuccessMessage", "🎉 Thank you! Your feature request has been submitted.");

        return "redirect:/";
    }

}
