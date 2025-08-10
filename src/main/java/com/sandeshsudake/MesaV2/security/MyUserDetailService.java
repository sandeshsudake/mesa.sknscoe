package com.sandeshsudake.MesaV2.security;

import com.sandeshsudake.MesaV2.entity.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.sandeshsudake.MesaV2.repository.userRepo;

import java.util.HashSet;
import java.util.Set;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    userRepo userRepo;
    String [] roles = {"ROLE_USER", "ROLE_ADMIN"};
    Set<GrantedAuthority> authorities;

    public MyUserDetailService(com.sandeshsudake.MesaV2.repository.userRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        user user = userRepo.findByUserName(username);

        if (user == null){
            throw new UsernameNotFoundException("No user found with username:" + username);
        }

        else {

            authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority(roles[user.getIdRole()]));
        }

        return new User(user.getUserName(),user.getUserPassword(),authorities);
    }
}
