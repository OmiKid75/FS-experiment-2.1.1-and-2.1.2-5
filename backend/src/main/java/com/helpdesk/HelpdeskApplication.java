package com.helpdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the HelpDesk Ticket Management System.
 *
 * This application demonstrates:
 * - RESTful API design (Experiment 2.1.1)
 * - Global exception handling & structured logging (Experiment 2.1.2)
 */
@SpringBootApplication
public class HelpdeskApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelpdeskApplication.class, args);
    }

}
