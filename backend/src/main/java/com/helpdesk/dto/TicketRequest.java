package com.helpdesk.dto;

import com.helpdesk.model.TicketCategory;
import com.helpdesk.model.TicketPriority;
import com.helpdesk.model.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Request payload used for creating or updating a ticket.
 * Validation happens here, before any business logic executes.
 */
@Data
public class TicketRequest {

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 5, max = 100, message = "Title must contain between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Size(min = 10, max = 500, message = "Description must contain between 10 and 500 characters")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    // Optional - only relevant on update. Defaults to OPEN on create.
    private TicketStatus status;
}
