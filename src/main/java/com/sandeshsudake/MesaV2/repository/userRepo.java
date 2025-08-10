package com.sandeshsudake.MesaV2.repository;

import com.sandeshsudake.MesaV2.entity.user;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface userRepo extends MongoRepository<user, String> {

    // This is the correct method signature to find a User by their userName.
    // Spring Data will automatically implement this for you.
    user findByUserName(String userName);
    List<user> findByIdRole(int idRole); // Correct method to find a list of users by role

}