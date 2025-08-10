package com.sandeshsudake.MesaV2.entity;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

@Document
@Data
@NoArgsConstructor
@Getter
@Setter
public class Event {

    @Id
    private String eventId;
    private String eventName;
    private String eventDay;
    private String eventMonth;
    private String eventTime;
    private String eventLocation;
    private String eventDesc;
    private String eventRegFees;
    private String qrImgURL;
    private String eventType;
    private String eventRegLink;

    // Change this to store a list of user IDs instead of full User objects
    private List<String> registeredUserIds;
}