package www.dream.bbs.shelter.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name="T_shelter")
@NoArgsConstructor
public class ShelterVO {
	@EmbeddedId
	private ShelterId shelterId;
	private String name;
	private String addr;
	private String usageType; 
	private int displayLv;
	
	public ShelterVO(ShelterId id, String name, String addr, String usageType) {
		shelterId = id;
		this.name = name;
		this.addr = addr;
		this.usageType = usageType;
		displayLv = (int)((Math.random() * (100 - 1)) + 1); // 관리자가 설정해서 저장
	}

	@Override
	public String toString() {
		return "ShelterVO [shelterId=" + shelterId + ", name=" + name + ", addr=" + addr + ", usageType=" + usageType
				+ ", displayLv=" + displayLv + "]";
	}

	
	
	
}
