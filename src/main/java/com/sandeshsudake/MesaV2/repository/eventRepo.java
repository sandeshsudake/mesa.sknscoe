package com.sandeshsudake.MesaV2.repository;

import com.sandeshsudake.MesaV2.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface eventRepo extends MongoRepository<Event,String> {
}
