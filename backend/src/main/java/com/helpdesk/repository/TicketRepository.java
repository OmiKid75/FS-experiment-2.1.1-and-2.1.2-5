package com.helpdesk.repository;

import com.helpdesk.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository layer - handles direct interaction with MongoDB.
 * Spring Data MongoDB generates the implementation at runtime.
 */
@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
}
