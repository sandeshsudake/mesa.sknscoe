package com.sandeshsudake.MesaV2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
public class MesaV2Application {

	public static void main(String[] args) {
		SpringApplication.run(MesaV2Application.class, args);
	}

}
