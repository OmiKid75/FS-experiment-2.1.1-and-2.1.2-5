package com.helpdesk.service;

import com.helpdesk.dto.TicketRequest;
import com.helpdesk.model.Ticket;
import com.helpdesk.model.TicketCategory;
import com.helpdesk.model.TicketPriority;
import com.helpdesk.model.TicketStatus;

import java.util.List;
import java.util.Map;

/**
 * Business logic contract for ticket operations.
 * Controllers depend on this interface, not on the implementation.
 */
public interface TicketService {

    Ticket createTicket(TicketRequest request);

    List<Ticket> getAllTickets(TicketStatus status, TicketPriority priority, TicketCategory category, String search);

    Ticket getTicketById(String id);

    Ticket updateTicket(String id, TicketRequest request);

    void deleteTicket(String id);

    Map<String, Long> getStatistics();
}
