package www.dream.bbs.webclient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import www.dream.bbs.shelter.model.ShelterId;
import www.dream.bbs.shelter.model.ShelterVO;
import www.dream.bbs.shelter.service.ShelterService;

@Service
@PropertySource("classpath:application.properties")
public class WebClient4Shelter {
	private String seoulKey = "796a576847676975363464424e7854";
	
	@Autowired
	private ShelterService shelterService;
	
	public void loadShelter() {
		WebClient webClient = WebClient.builder().baseUrl("http://openapi.seoul.go.kr:8088")
				.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).build();
		String result = webClient.get().uri("/" + seoulKey + "/json/TlEtqkP/1/1").retrieve().bodyToMono(String.class).block();
		
		Map<String, Object> map = this.jsonToMap(result);
		
		int seoulShelterTotalCount = (int) ((Map)map.get("TlEtqkP")).get("list_total_count");
		int step = 500;
		for (int i = 1; i < seoulShelterTotalCount; i += step) {
			String subUri = "/" + seoulKey + "/json/TlEtqkP/" + i + "/" + (i + 500);
			result = webClient.get().uri(subUri).retrieve().bodyToMono(String.class).block();
			map = this.jsonToMap(result);
			
			List seoulShelters = (List) ((Map)map.get("TlEtqkP")).get("row");
			
			List<ShelterVO> seoulShelterVos = new ArrayList<>();
			
			for (Object obj : seoulShelters) {
				Map shelter = (Map) obj;
				ShelterId id = new ShelterId(Float.parseFloat((String) shelter.get("YCORD")), // 경도 
						Float.parseFloat((String) shelter.get("XCORD")));  // 위도
				
				ShelterVO shelterVO = new ShelterVO(id, (String) shelter.get("EQUP_NM"), (String) shelter.get("LOC_SFPR_A"), "지진-옥외"); // EQUP_NM: 장소명, LOC_SFPR_A: 주소
				
				seoulShelterVos.add(shelterVO);
			}
			shelterService.uploadShelter(seoulShelterVos);
		}	
	}
	
	private Map<String, Object> jsonToMap(String json) {
		ObjectMapper objectMapper = new ObjectMapper();
		TypeReference<Map<String, Object>> typeReference = new TypeReference<Map<String, Object>>() {};
		try {
			return objectMapper.readValue(json, typeReference);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new HashMap<>();
	}
}
