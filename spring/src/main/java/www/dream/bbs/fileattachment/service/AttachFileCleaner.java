package www.dream.bbs.fileattachment.service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import www.dream.bbs.fileattachment.model.dto.AttachFileDTO;
import www.dream.bbs.fileattachment.repository.AttachFileRepository;

@Service
@PropertySource("classpath:application.properties")
public class AttachFileCleaner {
	public static final char DATE_STRING_DELIMETER = ':';
	public static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy:MM:dd");
	private String uploadDir = "c:-upload";

	@Autowired // SpEL
	public void setValues(@Value("#{'${upload.file.dir}'}") String value) {
		if (!ObjectUtils.isEmpty(value)) {
			this.uploadDir = value;
		}
		uploadDir = uploadDir.replace("-", File.separator); // 2023\09\19 이식성
	}

	@Autowired
	private AttachFileRepository attachFileRepository;

	public String getUploadDir() {
		return uploadDir;
	}

	// PostService, PartyService, BoardService...과 연결되어 있으면 어덯게 할까?
	// Framework화 시켜야하지 않을까?
	// 매일이 시작 할 때 실행
	@Scheduled(cron = "0 0 0 * * *")
	public void crearAttachFile() throws InterruptedException {
		System.out.println("crearAttachFile 실행 시작");
		// 어제 등록된 첨부 정보를 DB에서 확보
		List<String> dur = getDuration();

		// path에서 모든 파일을 바탕으로 DB에 등록되지 않은...
		// DB에 등록되어 있는... 잘 관리 중인 첨부 정보들
		List<AttachFileDTO> listManaged = attachFileRepository.findByPathNameIn(dur);
		// path 만들기
		Set<File> listUploadedFiles = new HashSet<>();
		for (String aDay : dur) {
			String fullPath = uploadDir + File.separator
					+ aDay.replace(DATE_STRING_DELIMETER, File.separator.charAt(0));

			File[] arrFile = new File(fullPath).listFiles();
			if (arrFile != null)
				Stream.of(arrFile).filter(file -> !file.isDirectory()).forEach(file -> listUploadedFiles.add(file));
		}
		// 미아 상태의 파일에 대하여
		// 잘 관리 중인 첨부 파일 이름들
		Set<String> setManagedFileName = listManaged.stream().map(AttachFileDTO::pureFileName)
				.collect(Collectors.toSet());
		listManaged.stream().filter(AttachFileDTO::hasThumbnail).map(AttachFileDTO::thumbFileName)
				.forEach(fn -> setManagedFileName.add(fn));

		Set<File> orpantFiles = listUploadedFiles.stream().filter(file -> !setManagedFileName.contains(file.getName()))
				.collect(Collectors.toSet());
		// 청소
		for (File f : orpantFiles) {
			f.delete();
		}

	}

	/** 
	 * 검사 할 일 수만큼의 날짜 생성하기
	 */
	private List<String> getDuration() {
		List<String> ret = new ArrayList<>();
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, -3);	//몇일 전 부터 검사할까?
		for (int j = 0; j < 2; j++) {	// 몇일 분을 검사하지?
			String aDay = sdf.format(calendar.getTime());
			ret.add(aDay);
			calendar.add(Calendar.DATE, 1);
		}
		return ret;
	}
}
