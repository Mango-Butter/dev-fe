export interface Store {
  businessNumber: string; // 사업자등록번호 (필수)
  name: string; // 매장명 (필수)
  address: string; // 주소 (필수)
  latitude: number; // 위도 (필수)
  longitude: number; // 경도 (필수)

  // 선택 항목
  accountNumber?: string; // 자동송금 계좌번호
  bankName?: string; // 은행명
  accountHolder?: string; // 예금주명

  openTime?: string; // 영업 시작 시간 (ex: '09:00')
  closeTime?: string; // 영업 종료 시간 (ex: '18:00')
  category?: string; // 업종 (ex: 카페, 음식점 등)
  notice?: string; // 공지 사항
  openChatUrl?: string; // 오픈채팅 링크

  attendanceType?: "QR" | "GPS"; // 출퇴근 방식
  maxExtraHours?: number; // 추가 근무 최대 허용시간
  salaryUnit?: number; // 급여 시간 단위 (분 단위)
  salaryPaymentDay?: number; // 급여 지급일 (1~31)
  attendanceRadius?: number; // 출퇴근 허용 반경 (미터 단위)
}
