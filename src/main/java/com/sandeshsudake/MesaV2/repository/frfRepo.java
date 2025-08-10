package com.sandeshsudake.MesaV2.repository;

import com.sandeshsudake.MesaV2.entity.FRF;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface frfRepo extends MongoRepository<FRF,String> {
}
