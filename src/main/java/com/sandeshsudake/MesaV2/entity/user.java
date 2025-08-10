package com.sandeshsudake.MesaV2.entity;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document
@Data
@NoArgsConstructor
@Getter
@Setter
public class user {

    @Id
    private String userId;
    private String userFullName;
    @Indexed(unique = true)
    private String userName;
    private int idRole;
    private String userClass;
    private String userBranch;
    private String userCollege;
    @Indexed(unique = true)
    private String userMail;
    @Indexed(unique = true)
    private String userMobile;
    private String userPassword;
    private String userQrURL;

    // Corrected to a list of event IDs
    private List<String> registeredEventIds;
}