package com.sandeshsudake.MesaV2.repository;

import com.sandeshsudake.MesaV2.entity.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface registrationRepo extends MongoRepository<Registration,String> {

    // Inside your registrationRepo.java interface
    List<Registration> findByEmail(String email);
    // Add this method inside your registrationRepo.java interface
    List<Registration> findByEventId(String eventId);


}
