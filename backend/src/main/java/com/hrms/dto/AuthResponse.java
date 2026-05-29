package com.hrms.dto;

import com.hrms.entity.Role;
import lombok.*;
import java.util.Set;
import java.util.stream.Collectors;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles;
    private String department;
    private String position;

    public static AuthResponse fromUser(com.hrms.entity.User user, String token) {
        return AuthResponse.builder()
            .token(token)
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
            .department(user.getDepartment())
            .position(user.getPosition())
            .build();
    }
}
