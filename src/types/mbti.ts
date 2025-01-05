/**
 * MBTI Type Definitions and Data
 * Contains type definitions and data for different MBTI personality types
 */

// Interface defining the structure of an MBTI type
export type MBTIType = {
  type: string;        // Four-letter MBTI code (e.g., 'INTJ')
  title: string;       // Title of the personality type
  description: string; // Brief description of the personality type
  strengths: string[]; // Array of personality strengths
  weaknesses: string[]; // Array of personality weaknesses
  careers: string[];   // Array of recommended careers
};

// Database of MBTI types and their characteristics
export const mbtiData: Record<string, MBTIType> = {
  'INTJ': {
    type: 'INTJ',
    title: '용의주도한 전략가 (Architect)',
    description: '상상력이 풍부하며 철저한 계획을 세우는 전략적 사고가들입니다.',
    strengths: ['분석적 사고', '전략적 계획', '독창성', '결단력'],
    weaknesses: ['완벽주의', '비판적 성향', '고집이 강함'],
    careers: ['데이터 과학자', '시스템 설계자', '전략 컨설턴트', '연구원']
  },
  'INTP': {
    type: 'INTP',
    title: '논리적인 사색가 (Logician)',
    description: '끊임없이 새로운 지식을 탐구하는 혁신적인 발명가입니다.',
    strengths: ['논리적 사고', '창의성', '객관성', '적응력'],
    weaknesses: ['과도한 분석', '우유부단함', '실용성 부족'],
    careers: ['프로그래머', '철학자', '수학자', '분석가']
  },
  'ENTJ': {
    type: 'ENTJ',
    title: '대담한 통솔자 (Commander)',
    description: '카리스마 있는 리더십으로 목표를 달성하는 전략가입니다.',
    strengths: ['리더십', '결단력', '효율성', '전략적 사고'],
    weaknesses: ['참을성 부족', '완고함', '감정 표현 부족'],
    careers: ['경영자', 'CEO', '관리자', '컨설턴트']
  },
  'ENTP': {
    type: 'ENTP',
    title: '뜨거운 논쟁을 즐기는 변론가 (Debater)',
    description: '지적 도전을 즐기며 창의적인 문제 해결사입니다.',
    strengths: ['창의성', '적응력', '논리력', '순발력'],
    weaknesses: ['논쟁적', '집중력 부족', '규칙 무시'],
    careers: ['기업가', '변호사', '발명가', '마케터']
  },
  'INFJ': {
    type: 'INFJ',
    title: '선의의 옹호자 (Advocate)',
    description: '조용하고 신비로운 통찰력으로 타인을 이해하는 이상주의자입니다.',
    strengths: ['통찰력', '창의성', '헌신', '결단력'],
    weaknesses: ['완벽주의', '내향성', '번아웃 취약'],
    careers: ['상담사', '작가', '교사', '예술가']
  },
  'INFP': {
    type: 'INFP',
    title: '열정적인 중재자 (Mediator)',
    description: '이상적인 세상을 추구하는 낭만적인 이상주의자입니다.',
    strengths: ['창의성', '공감능력', '적응력', '이상주의'],
    weaknesses: ['현실감각 부족', '감정적', '우유부단함'],
    careers: ['작가', '심리상담사', '예술가', '교사']
  },
  'ENFJ': {
    type: 'ENFJ',
    title: '정의로운 사회운동가 (Protagonist)',
    description: '카리스마 있는 리더십으로 타인을 이끄는 이상주의자입니다.',
    strengths: ['리더십', '공감능력', '소통능력', '영향력'],
    weaknesses: ['과도한 이상주의', '과민반응', '완벽주의'],
    careers: ['교육자', '상담사', '인사관리자', '사회활동가']
  },
  'ENFP': {
    type: 'ENFP',
    title: '재기발랄한 활동가 (Campaigner)',
    description: '열정적이고 창의적인 자유로운 영혼입니다.',
    strengths: ['창의성', '열정', '적응력', '친화력'],
    weaknesses: ['집중력 부족', '현실감각 부족', '조직력 부족'],
    careers: ['예술가', '작가', '연예인', '마케터']
  },
  'ISTJ': {
    type: 'ISTJ',
    title: '청렴결백한 논리주의자 (Logistician)',
    description: '사실에 근거하여 신중하고 철저한 관리자입니다.',
    strengths: ['체계성', '신뢰성', '실용성', '책임감'],
    weaknesses: ['융통성 부족', '변화 거부', '감정표현 부족'],
    careers: ['회계사', '관리자', '공무원', '엔지니어']
  },
  'ISFJ': {
    type: 'ISFJ',
    title: '용감한 수호자 (Defender)',
    description: '헌신적이고 따뜻한 수호자입니다.',
    strengths: ['신뢰성', '인내심', '세심함', '헌신'],
    weaknesses: ['변화 거부', '자기주장 부족', '비판 수용 어려움'],
    careers: ['간호사', '행정지원', '교사', '사회복지사']
  },
  'ESTJ': {
    type: 'ESTJ',
    title: '엄격한 관리자 (Executive)',
    description: '사실적이고 실용적인 관리자입니다.',
    strengths: ['체계성', '리더십', '책임감', '효율성'],
    weaknesses: ['융통성 부족', '감정 둔감', '독단적'],
    careers: ['관리자', '군인', '판사', '경영자']
  },
  'ESFJ': {
    type: 'ESFJ',
    title: '사교적인 외교관 (Consul)',
    description: '타인을 돕는 것을 좋아하는 사교적인 조력자입니다.',
    strengths: ['협동심', '신뢰성', '봉사정신', '실용성'],
    weaknesses: ['비판에 민감', '주목 필요', '융통성 부족'],
    careers: ['교사', '간호사', '상담사', '영업직']
  },
  'ISTP': {
    type: 'ISTP',
    title: '만능 재주꾼 (Virtuoso)',
    description: '대담하고 현실적인 문제 해결사입니다.',
    strengths: ['적응력', '창의성', '실용성', '논리력'],
    weaknesses: ['충동적', '고집', '감정표현 부족'],
    careers: ['기술자', '엔지니어', '운동선수', '수리공']
  },
  'ISFP': {
    type: 'ISFP',
    title: '호기심 많은 예술가 (Adventurer)',
    description: '자유로운 영혼을 가진 예술가입니다.',
    strengths: ['창의성', '적응력', '감수성', '충실성'],
    weaknesses: ['경쟁 회피', '미루기', '스트레스에 약함'],
    careers: ['예술가', '디자이너', '음악가', '요리사']
  },
  'ESTP': {
    type: 'ESTP',
    title: '모험을 즐기는 사업가 (Entrepreneur)',
    description: '위험을 즐기는 행동가입니다.',
    strengths: ['대담성', '적응력', '실용성', '활력'],
    weaknesses: ['인내심 부족', '위험 감수', '계획성 부족'],
    careers: ['기업가', '영업직', '운동선수', '경찰']
  },
  'ESFP': {
    type: 'ESFP',
    title: '자유로운 영혼의 연예인 (Entertainer)',
    description: '즉흥적이고 열정적인 연예인입니다.',
    strengths: ['열정', '친화력', '적응력', '창의성'],
    weaknesses: ['집중력 부족', '계획성 부족', '갈등 회피'],
    careers: ['연예인', '영업직', '이벤트 기획자', '호텔리어']
  }
};