package com.example.collegeManagementSystem.collage.configs;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class modelMapperConfig {

    @Bean
    public ModelMapper getModeMapper(){
        return new ModelMapper();
    }
}

