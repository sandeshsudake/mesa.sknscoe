package com.sandeshsudake.MesaV2.entity;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime; // Import LocalDateTime

@Document
@Data
@Getter
@Setter
public class Registration {
    @Id
    private String regID;

    private String eventId;
    private String eventName;
    private String studentName;
    private String studentClass;
    private String branch;
    private String collegeName;
    private String email;
    private String mobileNo;
    private String utrNumber;
    private String paymentProofURL;
    private LocalDateTime regDateTime; // <-- Added this field

}