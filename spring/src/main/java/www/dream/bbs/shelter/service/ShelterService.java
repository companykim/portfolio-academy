package www.dream.bbs.shelter.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import www.dream.bbs.shelter.model.ShelterVO;
import www.dream.bbs.shelter.respository.ShelterRepository;

@Service
public class ShelterService {
	@Autowired
	private ShelterRepository shelterRepository;
	
	public int uploadShelter(List<ShelterVO> listShelterVO) {
		int dupCount = 0;
		for (ShelterVO obj : listShelterVO) {
			try {
				shelterRepository.save(obj);
			} catch(Exception e) {
				dupCount++;
			}
		}
		System.out.println("Shelter 입력 중" + dupCount + "건의 중복 발생하여 이는 무시함.");
		return 0;
	}
	/** 1meter 당 위도 */
	private static final float LAT_PER_METER = 0.000021f;
	/** 1meter 당 경도 */
	private static final float LNG_PER_METER = 0.0000111f;
	
	public List<ShelterVO> listShelter(String usageType, float lat, float lng, int displayLv, int halfBoundary) {
		// 특정한 사각형 내부에 있는 대피소 목록 조회
		/*
		 *select * 
  			from T_shelter
		  where usage_type like '%지진%'
  		  and lat < 37.487035 + 0.021 * 500
          and lat > 37.487035 - 0.021 * 500
          and lng > 126.850974 - 0.0111 * 500
          and lng < 126.850974 + 0.0111 * 500
          and display_level > 30
		 */
		float 서쪽경계, 동쪽경계, 북쪽, 남쪽;
		서쪽경계 = lng - LNG_PER_METER * halfBoundary;
		동쪽경계 = lng + LNG_PER_METER * halfBoundary;
		북쪽 = lat + LAT_PER_METER * halfBoundary;
		남쪽 = lat - LAT_PER_METER * halfBoundary;
		usageType = "%" + usageType + "%";
		return shelterRepository.findShelter(usageType, 서쪽경계, 동쪽경계, 북쪽, 남쪽, displayLv);
	}
}
