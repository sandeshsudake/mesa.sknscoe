package com.sandeshsudake.MesaV2.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sandeshsudake.MesaV2.entity.Event;
import com.sandeshsudake.MesaV2.entity.FRF;
import com.sandeshsudake.MesaV2.entity.Registration;
import com.sandeshsudake.MesaV2.entity.user;
import com.sandeshsudake.MesaV2.repository.eventRepo;
import com.sandeshsudake.MesaV2.repository.registrationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import com.sandeshsudake.MesaV2.repository.userRepo;
import com.sandeshsudake.MesaV2.repository.frfRepo;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
public class adminController {

    @Autowired
    Cloudinary cloudinary;

    @Autowired
    eventRepo eventRepo;

    @Autowired
    userRepo userRepo;

    @Autowired
    registrationRepo registrationRepo;

    @Autowired
    frfRepo frfRepo;

    @GetMapping("/admin")
    public String adminPage(Model model, @CurrentSecurityContext(expression ="authentication?.name") String username){
        user loggedAdmin = userRepo.findByUserName(username);
        model.addAttribute("loggedAdmin",loggedAdmin);

        List<Event> allEvents = eventRepo.findAll();
        model.addAttribute("pmfEvents", allEvents.stream().filter(e -> "form".equals(e.getEventType())).toList());
        model.addAttribute("gformEvents", allEvents.stream().filter(e -> "link".equals(e.getEventType())).toList());
        List<user> adminList = userRepo.findByIdRole(1); // Call the new method
        model.addAttribute("adminList", adminList);


        List<FRF> frfList = frfRepo.findAll();
        model.addAttribute("frfList",frfList);

        // Fetch counts from repositories
        long eventCount = eventRepo.count();
        long regCount = registrationRepo.count();
        long frfCount = frfRepo.count();
        long userCount = userRepo.count();

        // Add counts to the model
        model.addAttribute("eventCount", eventCount);
        model.addAttribute("regCount", regCount);
        model.addAttribute("frfCount", frfCount);
        model.addAttribute("userCount", userCount);



        return "admin";
    }

    @PostMapping("/addPMFEvent")
    public String addPMFEvent(Event event, @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            if (event.getEventId() == null || event.getEventId().isEmpty()) {
                event.setEventId(UUID.randomUUID().toString());
            }

            if (file != null && !file.isEmpty()) {
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                event.setQrImgURL((String) uploadResult.get("secure_url"));
            }

            event.setEventType("form");
            event.setEventRegLink("Null");
            eventRepo.save(event);
            System.out.println("PMF Event saved successfully: " + event.getEventName());

        } catch (IOException e) {
            System.err.println("File processing failed: " + e.getMessage());
            return "redirect:/admin?error=file_upload_failed";
        } catch (Exception e) {
            System.err.println("An unexpected error occurred: " + e.getMessage());
            e.printStackTrace();
            return "redirect:/admin?error=internal_server_error";
        }
        return "redirect:/admin";
    }

    @PostMapping("/addGoogleFormEvent")
    public String addGformEvent(Event event){
        if (event.getEventId() == null || event.getEventId().isEmpty()) {
            event.setEventId(UUID.randomUUID().toString());
        }
        event.setEventType("link");
        eventRepo.save(event);
        System.out.println("G-Form Event saved successfully: " + event.getEventName());
        return "redirect:/admin";
    }

    @PostMapping("/deleteEvent")
    public String deleteEvent(@RequestParam("eventId") String eventId) {
        try {
            eventRepo.deleteById(eventId);
            System.out.println("Event with ID " + eventId + " deleted successfully.");
        } catch (Exception e) {
            System.err.println("Error deleting event: " + e.getMessage());
            e.printStackTrace();
        }
        return "redirect:/admin";
    }

    @PostMapping("/addAdmin")
    public String addAdmin(
            @RequestParam("name") String name,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            Model model) {

        // Check if a user with this username already exists
        user existingUser = userRepo.findByUserName(username);
        if (existingUser != null) {
            model.addAttribute("error", "Username already exists.");
            return "redirect:/admin";
        }

        user newUser = new user();
        newUser.setUserId(UUID.randomUUID().toString());
        newUser.setUserFullName(name);
        newUser.setUserName(username);
        newUser.setUserMail(email);

        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = bCryptPasswordEncoder.encode(password);

        newUser.setUserPassword(encodedPassword);
        newUser.setIdRole(1); // Set the role for an admin

        // FIX: Set a unique placeholder for the mobile number to avoid database errors.
        newUser.setUserMobile("admin-" + UUID.randomUUID().toString());

        userRepo.save(newUser);

        return "redirect:/admin";
    }



    // New method to handle the report page
    @GetMapping("/report/{eventId}")
    public String getReportPage(@PathVariable String eventId, Model model) {
        // Find the event by its ID, or return an error page if not found
        Event event = eventRepo.findById(eventId).orElse(null);
        if (event == null) {
            return "error"; // Or a specific "event not found" page
        }

        // Find all registrations for this specific event
        List<Registration> registrations = registrationRepo.findByEventId(eventId);

        model.addAttribute("event", event);
        model.addAttribute("registrations", registrations);

        return "report";
    }

}
