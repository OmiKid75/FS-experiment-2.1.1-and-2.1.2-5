package com.helpdesk.service;

import com.helpdesk.dto.TicketRequest;
import com.helpdesk.exception.TicketNotFoundException;
import com.helpdesk.model.Ticket;
import com.helpdesk.model.TicketCategory;
import com.helpdesk.model.TicketPriority;
import com.helpdesk.model.TicketStatus;
import com.helpdesk.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implements ticket business logic. Controllers stay thin; all
 * decision-making and orchestration happens here.
 */
@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private static final Logger log = LoggerFactory.getLogger(TicketServiceImpl.class);

    private final TicketRepository ticketRepository;

    @Override
    public Ticket createTicket(TicketRequest request) {
        log.info("Creating ticket: {}", request.getTitle());

        LocalDateTime now = LocalDateTime.now();
        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .priority(request.getPriority())
                .status(TicketStatus.OPEN)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Ticket saved = ticketRepository.save(ticket);
        log.info("Ticket created successfully with id: {}", saved.getId());
        return saved;
    }

    @Override
    public List<Ticket> getAllTickets(TicketStatus status, TicketPriority priority, TicketCategory category, String search) {
        log.info("Fetching tickets [status={}, priority={}, category={}, search={}]", status, priority, category, search);

        List<Ticket> tickets = ticketRepository.findAll();

        return tickets.stream()
                .filter(t -> status == null || t.getStatus() == status)
                .filter(t -> priority == null || t.getPriority() == priority)
                .filter(t -> category == null || t.getCategory() == category)
                .filter(t -> search == null || search.isBlank()
                        || t.getTitle().toLowerCase().contains(search.toLowerCase())
                        || t.getDescription().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    public Ticket getTicketById(String id) {
        log.info("Fetching ticket with id: {}", id);
        return ticketRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Ticket not found with id: {}", id);
                    return new TicketNotFoundException(id);
                });
    }

    @Override
    public Ticket updateTicket(String id, TicketRequest request) {
        log.info("Updating ticket with id: {}", id);

        Ticket existing = getTicketById(id);

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setCategory(request.getCategory());
        existing.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            existing.setStatus(request.getStatus());
        }
        existing.setUpdatedAt(LocalDateTime.now());

        Ticket updated = ticketRepository.save(existing);
        log.info("Ticket updated successfully: {}", id);
        return updated;
    }

    @Override
    public void deleteTicket(String id) {
        log.info("Deleting ticket with id: {}", id);
        Ticket existing = getTicketById(id);
        ticketRepository.delete(existing);
        log.info("Ticket deleted successfully: {}", id);
    }

    @Override
    public Map<String, Long> getStatistics() {
        log.info("Computing ticket statistics");
        List<Ticket> all = ticketRepository.findAll();

        return Map.of(
                "total", (long) all.size(),
                "open", all.stream().filter(t -> t.getStatus() == TicketStatus.OPEN).count(),
                "inProgress", all.stream().filter(t -> t.getStatus() == TicketStatus.IN_PROGRESS).count(),
                "resolved", all.stream().filter(t -> t.getStatus() == TicketStatus.RESOLVED).count(),
                "closed", all.stream().filter(t -> t.getStatus() == TicketStatus.CLOSED).count(),
                "critical", all.stream().filter(t -> t.getPriority() == TicketPriority.CRITICAL).count()
        );
    }
}
