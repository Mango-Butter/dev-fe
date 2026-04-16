# 🥭 MangoBoss (망고보스)

> [<img width="1720" height="1144" alt="image (10)" src="https://github.com/user-attachments/assets/56359780-bdb8-4f1b-8508-ed3af7fa37ce" />](https://drive.google.com/file/d/1avQXxRjYqYMZdZu0MLEnuBWkBaB1wWlD/view)
> 서비스 시연 영상 (Service Demo)


> **"복잡한 매장 관리, 이제 망고보스 하나로 끝."**
> 소상공인 사장님들을 위한 **올인원 매장 관리 솔루션(SaaS)** 프론트엔드 저장소입니다.

<br/>

## 🔗 배포 및 문서 (Links)
* **Service URL**: [https://www.mangoboss.com](https://www.mangoboss.com)
* **Team Notion**: [MangoBoss Team Docs](https://www.notion.so/1af52a9c0c5380e6b73beb5fc5e64aea)
* **Personal Docs**: [Dev Progress](https://www.notion.so/MangoBoss-1aea0b0c7d4c805c8204eba5bb540b55)

<br/>

## 📖 프로젝트 배경 (Background)

**"사장님은 장사에만 집중하세요, 관리는 망고보스가 할게요."**

많은 자영업자분들이 재고 관리, 직원 스케줄링, 매출 정산을 위해 엑셀을 켜거나 여러 개의 앱을 번갈아 사용하며 시간을 낭비하고 있습니다.
**MangoBoss**는 흩어져 있는 매장 관리 기능을 하나의 웹 대시보드로 통합하여, IT에 익숙하지 않은 사장님들도 직관적으로 사용할 수 있도록 UX를 설계했습니다.

<br/>

## ✨ 핵심 기능 (Key Features)

* **📊 실시간 매출 대시보드**: 차트 라이브러리를 활용하여 일간/주간/월간 매출 추이를 시각화
* **📦 스마트 재고 관리**: 재고 부족 시 알림 제공 및 원클릭 발주 시스템
* **📅 직원 스케줄링**: 드래그 앤 드롭(DnD)으로 간편하게 알바생 근무표 작성
* **📱 반응형 웹 (Mobile First)**: PC 포스기는 물론, 이동 중인 사장님의 스마트폰에서도 완벽 호환
* **🔔 실시간 주문 알림**: 웹 소켓(Web Socket)을 연동하여 주문 접수 시 즉각적인 알림 제공

<br/>

## 🛠️ 기술 스택 (Tech Stack)

| 분류 | 기술 |
| :-- | :-- |
| **Framework** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white) |
| **State Mgt** | `Zustand` (전역 상태) |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **Visualization** | `Recharts` (매출 데이터 시각화) |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=Vite&logoColor=white) |

<br/>

## 📂 폴더 구조 (Directory Structure)

유지보수성과 확장성을 고려하여 **기능(Feature)** 단위와 **공통(Shared)** 단위를 분리하여 설계했습니다.

```bash
dev-fe/
├── src/
│   ├── api/             # Axios 인스턴스 및 API 요청 함수 모음
│   ├── assets/          # 이미지, 폰트, 아이콘 리소스
│   ├── components/      # 재사용 가능한 공통 UI (Button, Input 등)
│   ├── constants/       # 상수 데이터 (메뉴 리스트, 에러 메시지 등)
│   ├── hooks/           # 커스텀 훅 (useAuth, useSalesData 등)
│   ├── layout/          # 페이지 레이아웃 (Header, Sidebar)
│   ├── pages/           # 라우팅 페이지 (Dashboard, Inventory, Schedule)
│   ├── store/           # Zustand 전역 상태 관리
│   ├── types/           # TypeScript 타입 정의
│   ├── utils/           # 날짜 변환, 화폐 단위 포맷팅 등 유틸 함수
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── README.md
```

<br/>

## 🚀 설치 및 실행 (Getting Started)

```bash
# 1. 저장소 클론
git clone [https://github.com/Mango-Butter/dev-fe.git](https://github.com/Mango-Butter/dev-fe.git)

# 2. 패키지 설치
yarn install

# 3. 개발 서버 실행
yarn dev
```

<br/>

## 🚀 성능 최적화 (Performance Optimization)

초기 로딩 속도 개선과 렌더링 최적화를 위해 Vite의 빌드 전략을 수정하고 코드 분할을 적극적으로 도입했습니다.

* **번들 사이즈 96.8% 감소**: `React.lazy`, `Suspense` 및 `manualChunks` 전략을 적용하여 모놀리식 번들을 분리.
    * **Before**: 5MB (초기 단일 번들)
    * **After**: 161KB (Core Chunk)
    * **Result**: 전체 Chunk 구조를 1개 → 60개 이상으로 분산하여 TTI(Time to Interactive) 대폭 개선.
* **Lazy Loading 적용**: 랜딩 페이지 및 주요 섹션에 `Intersection Observer`를 도입하여 뷰포트에 진입할 때만 리소스를 로드하도록 개선.
* **비동기 UX 강화**: 데이터 페칭 대기 시간에 **Skeleton UI**와 **Lottie JSON 애니메이션**을 노출하여 체감 로딩 시간을 단축하고 끊김 없는 사용자 경험 제공.

<br/>

## 🏗️ 아키텍처 및 기술적 특징 (Architecture & Tech)

### 1. PWA & FCM 알림 시스템
* **PWA (Progressive Web App)**: `vite-plugin-pwa`를 활용하여 모바일 홈 화면 설치 지원 및 서비스 워커(Service Worker) 기반의 오프라인 캐시 전략 적용. 네트워크가 불안정한 환경에서도 핵심 기능 사용 가능.
* **Push Notification**: FCM(Firebase Cloud Messaging)을 연동하여 브라우저의 Foreground/Background 상태에 관계없이 실시간 주문/스케줄 알림 전송.

### 2. 상태 관리 및 라우팅 (State & Routing)
* **Zustand 기반 상태 분리**: 사장님(Admin)과 알바생(Staff)의 데이터 접근 범위가 다름을 고려하여, 전역 상태 스토어를 역할별로 분리 및 경량화.
* **Role-Based Access Control (RBAC)**:
    * `PublicRoute`: 비로그인 사용자 접근
    * `ProtectedRoute`: 로그인 사용자 전용
    * `RoleRoute`: 특정 권한(사장님/알바생)에 따른 페이지 접근 제어 및 리디렉션 처리

### 3. 디자인 시스템 (Design System)
* **Component-Driven Development**: **Tailwind CSS**와 **JSX in SVG**를 기반으로 유연한 디자인 시스템 구축.
* **Storybook 도입**: 공통 UI 컴포넌트(Button, Input, Modal 등)를 문서화하여 디자이너-개발자 간 협업 효율 증대 및 UI 일관성 유지.

### 4. SEO & 마케팅 (SEO & Meta)
* 상용 서비스 수준의 **SEO 메타태그**, **OpenGraph**, **PWA Manifest**를 완벽하게 구성하여 SNS 공유 시 미리보기 최적화 및 검색 엔진 노출 대응.

<br/>

## 🔒 보안 및 배포 파이프라인 (Security & DevOps)

### 🔐 클라이언트 보안 (Client Security)
* **AES 기반 데이터 암호화**: 전자근로계약서 등 민감 데이터 전송 시, 클라이언트에서 생성한 **Random Session Key**와 **Encryption Key**를 조합하여 AES 암호화 적용.
* **일회성 키 전략**: 전송 후 키를 파기하는 방식으로 데이터 탈취 및 중간자 공격(MITM) 방어.

### ☁️ CI/CD & Infrastructure
* **Automated Deployment**: GitHub Actions를 활용하여 `dev` (개발) → `test` (테스트) → `main` (운영) 브랜치별 자동 배포 파이프라인 구축.
* **AWS Serverless**: **Amazon S3**(정적 호스팅)와 **CloudFront**(CDN)를 연동하여 전 세계 어디서든 빠른 속도로 콘텐츠를 전송하고 SSL(HTTPS) 보안 적용.

<br/>

## 📬 Team Mango-Butter

| 이름 | 역할 |
| :-- | :-- | 
| **[윤석찬](https://github.com/PaleBlueNote)** | Frontend Lead
| **정현지** | Backend Lead 
| **심재엽** | Backend 
| **이명건** | Designer 

---
© 2026 Mango-Butter. All rights reserved.
