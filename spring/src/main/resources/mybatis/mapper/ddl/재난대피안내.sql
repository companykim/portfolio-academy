drop table T_shelter;
-- openapi.seoul.go.kr:(lat, lng, name)=(YCODE, XCODE, EQUP_NM)
-- lat, lng, name, usage_type,
-- 경도 1도는 111km, 적도기준, 0.0111 1km, 0.00001 1m
-- 위도 1도는 40000km/4/90 0.021 1km, 0.000021 1m
create table T_shelter (
	lat   float(10, 8) comment '위도', --openapi.seoul.go.kr:XCORD
	lng   float(10, 7) comment '경도', --openapi.seoul.go.kr:YCORD
	name  varchar(255),        --openapi.seoul.go.kr:EQUP_NM
	addr varchar(255),
	usage_type  varchar(1000), --지진:화재:홍수
	display_Lv int comment --'100:최첨단, 1:현미경',
	reg_dt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '등록일',
	upt_dt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '최종 정보 수정일',
	primary key(lat, lng)
);



insert into T_shelter (lat, lng, name, usage_type, display_level)
values(37.487035, 126.850974, '경인중학교 운동장', '지진-옥외', 5);
insert into T_shelter (lat, lng, name, usage_type, display_level)
values(37.488035, 126.853974, '가북동중학교 운동장', '지진-옥외', 40);
insert into T_shelter (lat, lng, name, usage_type, display_level)
values(37.507035, 126.850974, '먼북동중학교 운동장', '지진-옥외', 80);

select * 
  from T_shelter
where usage_type like '%지진%'
  and lat < 37.487035 + 0.021 * 500
  and lat > 37.487035 - 0.021 * 500
  and lng > 126.850974 - 0.0111 * 500
  and lng < 126.850974 + 0.0111 * 500
  and display_level > 30
  
  , lng, name, usage_type