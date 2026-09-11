package com.helpdesk.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * MongoDB document representing a support ticket.
 * Stored in the "tickets" collection of the "helpdesk" database.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String title;

    private String description;

    private TicketCategory category;

    private TicketPriority priority;

    @Builder.Default
    private TicketStatus status = TicketStatus.OPEN;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
