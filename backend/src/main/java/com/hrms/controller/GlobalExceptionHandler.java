package com.hrms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutionException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        String msg = ex.getMessage();
        if (msg == null) msg = "Internal server error";
        // Unwrap common messages
        if (msg.contains("User not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", msg));
        }
        if (msg.contains("already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", msg));
        }
        if (msg.contains("no base salary") || msg.contains("must be greater than 0")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", msg));
        }
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", msg));
    }

    @ExceptionHandler({ExecutionException.class, CompletionException.class})
    public ResponseEntity<Map<String, String>> handleAsyncException(Exception ex) {
        Throwable cause = ex.getCause();
        String msg = cause != null ? cause.getMessage() : ex.getMessage();
        if (msg == null) msg = "Internal server error";
        if (msg.contains("already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", msg));
        }
        if (msg.contains("User not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", msg));
        }
        if (msg.contains("no base salary") || msg.contains("must be greater than 0")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", msg));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", msg));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException ex) {
        String msg = ex.getMessage();
        if (msg == null) msg = "Authentication failed";
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        ex.printStackTrace();
        String msg = ex.getMessage();
        if (msg == null) msg = "Internal server error";
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", msg));
    }
}
