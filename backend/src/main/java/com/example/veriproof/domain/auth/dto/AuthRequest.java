package com.example.veriproof.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class AuthRequest {
    public record SignupRequest(
            @NotBlank
            String username,

            @NotBlank
            @Size(min = 8)
            String password,

            @NotBlank
            String name,

            @NotBlank
            String affiliation
    ) {}

    public record LoginRequest(
            @NotBlank
            String username,

            @NotBlank
            String password
    ) {}
}
