package com.hrms.service;

import com.hrms.dto.*;
import com.hrms.entity.Role;
import com.hrms.entity.User;
import com.hrms.repository.RoleRepository;
import com.hrms.repository.UserRepository;
import com.hrms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow();
        var springUser = (org.springframework.security.core.userdetails.User) auth.getPrincipal();
        String token = jwtUtil.generateToken(springUser);
        return AuthResponse.fromUser(user, token);
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");
        Role empRole = roleRepository.findByName(Role.RoleName.ROLE_EMPLOYEE).orElseThrow();
        User user = User.builder()
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .active(true)
            .build();
        user.getRoles().add(empRole);
        userRepository.save(user);
        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
            user.getEmail(), user.getPassword(), user.getRoles().stream()
                .map(r -> new org.springframework.security.core.authority.SimpleGrantedAuthority(r.getName().name()))
                .toList()));
        return AuthResponse.fromUser(user, token);
    }
}
