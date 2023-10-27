package www.dream.bbs.shelter.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import www.dream.bbs.board.model.BoardVO;
import www.dream.bbs.shelter.model.ShelterVO;
import www.dream.bbs.shelter.service.ShelterService;

@RestController		//Container에 담기도록 지정
@RequestMapping("/shelter")
public class ShelterController {
	@Autowired
	private ShelterService shelterService;
		
	// /halfBoundary meter 단위로 주세요
	@GetMapping("/{usageType}/{lat}/{lng}/{displayLv}/{halfBoundary}")
	public ResponseEntity<List<ShelterVO>> get(@PathVariable String usageType, @PathVariable float lat, @PathVariable float lng, @PathVariable int displayLv, @PathVariable int halfBoundary) {
		List<ShelterVO> result = shelterService.listShelter(usageType, lat, lng, displayLv, halfBoundary);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
}
