package com.sandeshsudake.MesaV2.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sandeshsudake.MesaV2.entity.Event;
import com.sandeshsudake.MesaV2.entity.Registration;
import com.sandeshsudake.MesaV2.entity.user;
import com.sandeshsudake.MesaV2.repository.userRepo;
import com.sandeshsudake.MesaV2.repository.registrationRepo;
import com.sandeshsudake.MesaV2.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.sandeshsudake.MesaV2.repository.eventRepo;

import java.io.IOException;
import java.time.LocalDateTime; // <-- Added this import
import java.util.*;

@Controller
public class userController {

    @Autowired
    userRepo userRepo;

    @Autowired
    eventRepo eventRepo;

    @Autowired
    registrationRepo registrationRepo;

    @Autowired
    Cloudinary cloudinary;

    @Autowired
    EmailService emailService;

    @GetMapping("/user")
    public String userPage(Model model, @CurrentSecurityContext(expression ="authentication?.name") String username) {
        // 1. Get the logged-in user
        user loggedUser = userRepo.findByUserName(username);
        model.addAttribute("loggedUser", loggedUser);

        // 2. Get all available events for the carousel
        List<Event> allEvents = eventRepo.findAll();
        model.addAttribute("events", allEvents);

        // 3. Get the user's registrations using their email
        List<Registration> userRegistrations = registrationRepo.findByEmail(loggedUser.getUserMail());

        // 4. Create a list to hold the combined data for the table
        List<Map<String, Object>> registeredEventsData = new ArrayList<>();

        // 5. For each registration, find the full event details and combine them
        for (Registration reg : userRegistrations) {
            if (reg.getEventId() != null) {
                eventRepo.findById(reg.getEventId()).ifPresent(event -> {
                    Map<String, Object> eventData = new HashMap<>();
                    eventData.put("registration", reg); // The registration object
                    eventData.put("event", event);       // The full event object
                    registeredEventsData.add(eventData);
                });
            }
        }

        // 6. Add the new combined list to the model
        model.addAttribute("registeredEventsData", registeredEventsData);

        return "user";
    }

    @PostMapping("/addNewUser")
    public String addNewUser(user user, RedirectAttributes redirectAttributes) {

        // Check if a user with this username already exists.
        user existingUser = userRepo.findByUserName(user.getUserName());

        if (existingUser != null) {
            System.err.println("Registration failed: Username " + user.getUserName() + " already exists.");
            redirectAttributes.addFlashAttribute("errorMessage", "Registration failed. That username is already taken.");
            return "redirect:/userRegForm";
        }

        // If the username is unique, proceed to save the new user.
        try {
            // Encode the password before saving
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
            String encodedUserPass = bCryptPasswordEncoder.encode(user.getUserPassword());
            user.setUserPassword(encodedUserPass);

            user.setIdRole(0); // Set role for a regular user
            userRepo.save(user);

            System.out.println("User " + user.getUserName() + " saved successfully.");
            redirectAttributes.addFlashAttribute("successMessage", "Registration successful! Please log in.");

            // --- Start of Improved Email Content ---

            String toEmail = user.getUserMail();
            String subject = "Welcome to MESA! Your Registration is Complete."; // More welcoming subject

            String body = "Hi " + user.getUserFullName() + ",\n\n"
                    + "Welcome to the MESA (Mechanical Engineering Students Association) platform! Your account has been successfully created.\n\n"
                    + "You're now ready to explore events, workshops, and seminars designed to provide valuable hands-on experience.\n\n"
                    + "Here is a summary of your account details for your records:\n"
                    + "----------------------------------------\n"
                    + "  Username:   " + user.getUserName() + "\n"
                    + "  Full Name:  " + user.getUserFullName() + "\n"
                    + "  Branch:     " + user.getUserBranch() + "\n"
                    + "  Class:      " + user.getUserClass() + "\n"
                    + "  College:    " + user.getUserCollege() + "\n"
                    + "  Email:      " + user.getUserMail() + "\n"
                    + "  Mobile No:  " + user.getUserMobile() + "\n"
                    + "----------------------------------------\n\n"
                    + "To get started, please log in to your account.\n\n"
                    + "This is an automated notification. Please do not reply to this email.\n\n"
                    + "Best regards,\n"
                    + "The MESA Team";

            // --- End of Improved Email Content ---

            try {
                emailService.sendEmail(toEmail, subject, body);
                System.out.println("Confirmation email sent to: " + toEmail + " for Successful new user reg");
            } catch (Exception e) {
                System.err.println("Failed to send confirmation email to " + toEmail + ": " + e.getMessage());
            }

            return "redirect:/login";
        } catch (DuplicateKeyException e) {
            // FIX: Catch the specific error for duplicate email or mobile
            System.err.println("Registration failed: Duplicate key error. " + e.getMessage());
            redirectAttributes.addFlashAttribute("errorMessage", "Registration failed. That email or mobile number is already registered.");
            return "redirect:/userRegForm";
        } catch (Exception e) {
            // This is a fallback for any other unexpected errors.
            System.err.println("An unexpected error occurred during registration: " + e.getMessage());
            redirectAttributes.addFlashAttribute("errorMessage", "An unexpected error occurred. Please try again later.");
            return "redirect:/userRegForm";
        }
    }


    @PostMapping("/registerEvent")
    public String registerEvent(Registration registration,
                                @RequestParam("paymentProof") MultipartFile file) throws IOException {


        // Manually set a unique ID if it's not already present
        if (registration.getRegID() == null || registration.getRegID().isEmpty()) {
            registration.setRegID(UUID.randomUUID().toString());
        }

        // The 'file' variable will now correctly contain the uploaded file.
        if (file != null && !file.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            registration.setPaymentProofURL((String) uploadResult.get("secure_url"));
        }

        // Set the current date and time for the registration
        registration.setRegDateTime(LocalDateTime.now()); // <-- Added this line

        registrationRepo.save(registration);

        return "redirect:/user";
    }

    @PostMapping("/updateProfile")
    public String updateProfile(user updatedUser, // Spring will bind form fields here
                                @CurrentSecurityContext(expression = "authentication?.name") String currentUsername,
                                RedirectAttributes redirectAttributes) {

        // --- SECURITY CHECK (CRUCIAL!) ---
        // Ensure the user is only updating their OWN profile.
        // The 'userName' from the form should match the 'currentUsername' from Spring Security.
        if (updatedUser.getUserName() == null || !updatedUser.getUserName().equals(currentUsername)) {
            redirectAttributes.addFlashAttribute("errorMessage", "Security Alert: Unauthorized profile update attempt!");
            return "redirect:/user"; // Redirect back to user page with error
        }

        // 1. Retrieve the EXISTING user from the database.
        // This is vital to avoid overwriting unsubmitted fields (like userPassword, userId, idRole, userQrURL, registeredEventIds).
        user existingUser = userRepo.findByUserName(currentUsername);

        if (existingUser != null) {
            // 2. Update ONLY the fields that are allowed to be changed via this form.
            // DO NOT update sensitive fields like userPassword, userId, or idRole here.
            existingUser.setUserFullName(updatedUser.getUserFullName());
            existingUser.setUserClass(updatedUser.getUserClass());
            existingUser.setUserBranch(updatedUser.getUserBranch());
            // FIX: Changed updatedUser.getCollege() to updatedUser.getUserCollege()
            existingUser.setUserCollege(updatedUser.getUserCollege());
            // IMPORTANT: Handle unique constraints for userMail and userMobile
            // You might need more sophisticated logic here if these fields can change and might conflict.
            // For simplicity, we'll just update directly, assuming validation handles uniqueness.
            existingUser.setUserMail(updatedUser.getUserMail());
            existingUser.setUserMobile(updatedUser.getUserMobile());

            try {
                // 3. Save the updated user object back to the database.
                userRepo.save(existingUser);
                // 4. Add a success flash attribute for the toast message.
                redirectAttributes.addFlashAttribute("successMessage", "🎉 Profile updated successfully!");
            } catch (org.springframework.dao.DuplicateKeyException e) {
                // Handle unique constraint violation (e.g., email or mobile already exists)
                redirectAttributes.addFlashAttribute("errorMessage", "Error: Email or Mobile Number already in use. Please use a different one.");
            } catch (Exception e) {
                // Catch any other unexpected errors during save
                redirectAttributes.addFlashAttribute("errorMessage", "An unexpected error occurred: " + e.getMessage());
            }

        } else {
            // This case should ideally not be reached if the user is logged in.
            redirectAttributes.addFlashAttribute("errorMessage", "Error: User profile not found.");
        }

        // 5. Redirect back to the user's profile page.
        return "redirect:/user";
    }



}