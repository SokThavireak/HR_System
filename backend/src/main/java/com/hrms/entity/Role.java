package com.hrms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter @Setter @NoArgsConstructor
public class Role {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleName name;

    private String description;

    public enum RoleName {
        ROLE_HR_ADMIN,
        ROLE_EMPLOYEE,
        ROLE_HR_VIEWER
    }

    public Role(RoleName name, String description) {
        this.name = name;
        this.description = description;
    }
}
