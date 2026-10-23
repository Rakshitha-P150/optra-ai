
package com.leadrecovery.ai_lead_recovery.controller;

import com.leadrecovery.ai_lead_recovery.entity.User;
import com.leadrecovery.ai_lead_recovery.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Map;
import com.leadrecovery.ai_lead_recovery.service.PasswordResetService;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://optra-ai.vercel.app"
})
public class AuthController {

	private final AuthService authService;
	private final PasswordResetService passwordResetService;

	public AuthController(
	        AuthService authService,
	        PasswordResetService passwordResetService) {
	    this.authService = authService;
	    this.passwordResetService = passwordResetService;
	}

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {
            User user = authService.register(
                request.fullName(),
                request.email(),
                request.password()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "message", "Account created successfully.",
                    "id", user.getId(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail()
                )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {
            User user = authService.login(
                request.email(),
                request.password()
            );

            return ResponseEntity.ok(
                Map.of(
                    "message", "Login credentials verified.",
                    "id", user.getId(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail()
                )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("message", "Invalid email or password.")
            );
        }
    }

    // REQUEST PASSWORD RESET
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            String token = passwordResetService.createResetToken(request.email());

            // Development only: returns token for local testing.
            return ResponseEntity.ok(
                Map.of(
                    "message", "Password reset token created. It expires in 15 minutes.",
                    "token", token
                )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        }
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.token(), request.newPassword());

            return ResponseEntity.ok(
                Map.of("message", "Password reset successfully. You can now log in.")
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        }
    }

    public record ForgotPasswordRequest(String email) {}
    public record ResetPasswordRequest(String token, String newPassword) {}

    public record RegisterRequest(
        String fullName,
        String email,
        String password
    ) {}

    public record LoginRequest(
        String email,
        String password
    ) {}
}
