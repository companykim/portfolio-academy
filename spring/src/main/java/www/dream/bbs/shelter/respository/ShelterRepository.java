package www.dream.bbs.shelter.respository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import www.dream.bbs.shelter.model.ShelterVO;

public interface ShelterRepository extends JpaRepository<ShelterVO, String>{
	@Query(nativeQuery = true, value = "select * "
			+ "from T_shelter "
			+ "where usage_type like :usageType "
			+ "and lat < :northBound "
			+ "and lat > :southBound "
			+ "and lng > :westBound "
			+ "and lng < :eastBound "
			+ "and display_Lv >= :displayLv")
	List<ShelterVO> findShelter(String usageType, float westBound, float eastBound, float northBound, float southBound, int displayLv);

}
