package www.dream.bbs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import www.dream.bbs.webclient.WebClient4Shelter;

@SpringBootApplication
@EnableScheduling
@Configuration
public class BullitineBoardApplication extends SpringBootServletInitializer {
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(BullitineBoardApplication.class);
	}
	
	@Autowired
	private WebClient4Shelter webClient4Shelter;
	@Scheduled(fixedRate=10000)
	public void work() {
		webClient4Shelter.loadShelter();
	}
	
	public static void main(String[] args) {
		SpringApplication.run(BullitineBoardApplication.class, args);
	}
}
