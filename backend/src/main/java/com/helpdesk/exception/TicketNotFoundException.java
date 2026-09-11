package com.helpdesk.exception;

/**
 * Thrown when a requested ticket does not exist in the database.
 * Handled centrally by GlobalExceptionHandler and translated to a 404.
 */
public class TicketNotFoundException extends RuntimeException {

    public TicketNotFoundException(String id) {
        super("Ticket not found with id: " + id);
    }
}
