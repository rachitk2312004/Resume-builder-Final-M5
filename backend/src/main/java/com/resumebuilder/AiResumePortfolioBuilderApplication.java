package com.resumebuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AiResumePortfolioBuilderApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiResumePortfolioBuilderApplication.class, args);
	}

}
