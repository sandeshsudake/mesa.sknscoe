package com.sandeshsudake.MesaV2.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@Getter
@Setter
public class FRF {

    @Id
    private String frfId;
    private String name;
    private String email;
    private String college;
    private String message;


}
