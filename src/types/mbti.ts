export type MBTIType = {
  type: string;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
};

type MBTIDescription = {
  ko: {
    title: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    careers: string[];
  };
  en: {
    title: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    careers: string[];
  };
};

export const mbtiData: { [key: string]: MBTIDescription } = {
  'ISTJ': {
    ko: {
      title: '청렴결백한 논리주의자',
      description: '사실에 근거하여 신중하고 철저한 관리자입니다.',
      strengths: ['체계성', '신뢰성', '실용성', '책임감'],
      weaknesses: ['융통성 부족', '변화 거부', '감정표현 부족'],
      careers: ['회계사', '관리자', '공무원', '엔지니어']
    },
    en: {
      title: 'Logistician',
      description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
      strengths: ['Systematic', 'Reliable', 'Practical', 'Responsible'],
      weaknesses: ['Inflexible', 'Resistant to change', 'Emotionally reserved'],
      careers: ['Accountant', 'Manager', 'Civil servant', 'Engineer']
    }
  },
  'ISFJ': {
    ko: {
      title: '용감한 수호자',
      description: '헌신적이고 따뜻한 수호자입니다.',
      strengths: ['신뢰성', '인내심', '세심함', '헌신'],
      weaknesses: ['변화 거부', '자기주장 부족', '비판 수용 어려움'],
      careers: ['간호사', '행정지원', '교사', '사회복지사']
    },
    en: {
      title: 'Defender',
      description: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
      strengths: ['Reliable', 'Patient', 'Detailed', 'Devoted'],
      weaknesses: ['Resistant to change', 'Overly humble', 'Takes criticism personally'],
      careers: ['Nurse', 'Administrative support', 'Teacher', 'Social worker']
    }
  },
  'INFJ': {
    ko: {
      title: '선의의 옹호자',
      description: '조용하고 신비로운 통찰력으로 타인을 이해하는 이상주의자입니다.',
      strengths: ['통찰력', '창의성', '헌신', '결단력'],
      weaknesses: ['완벽주의', '내향성', '번아웃 취약'],
      careers: ['상담사', '작가', '교사', '예술가']
    },
    en: {
      title: 'Advocate',
      description: 'Quiet and mystical, yet very inspiring and tireless idealists.',
      strengths: ['Insightful', 'Creative', 'Principled', 'Passionate'],
      weaknesses: ['Perfectionist', 'Overly private', 'Prone to burnout'],
      careers: ['Counselor', 'Writer', 'Teacher', 'Artist']
    }
  },
  'INTJ': {
    ko: {
      title: '용의주도한 전략가',
      description: '상상력이 풍부하며 철저한 계획을 세우는 전략적 사고가들입니다.',
      strengths: ['분석적 사고', '전략적 계획', '독창성', '결단력'],
      weaknesses: ['완벽주의', '비판적 성향', '고집이 강함'],
      careers: ['데이터 과학자', '시스템 설계자', '전략 컨설턴트', '연구원']
    },
    en: {
      title: 'Architect',
      description: 'Imaginative and strategic thinkers, with a plan for everything.',
      strengths: ['Analytical thinking', 'Strategic planning', 'Originality', 'Decisiveness'],
      weaknesses: ['Perfectionism', 'Critical nature', 'Stubbornness'],
      careers: ['Data Scientist', 'System Architect', 'Strategic Consultant', 'Researcher']
    }
  },
  'ISTP': {
    ko: {
      title: '만능 재주꾼',
      description: '대담하고 현실적인 문제 해결사입니다.',
      strengths: ['적응력', '창의성', '실용성', '논리력'],
      weaknesses: ['충동적', '고집', '감정표현 부족'],
      careers: ['기술자', '엔지니어', '운동선수', '수리공']
    },
    en: {
      title: 'Virtuoso',
      description: 'Bold and practical experimenters, masters of all kinds of tools.',
      strengths: ['Adaptable', 'Creative', 'Practical', 'Logical'],
      weaknesses: ['Impulsive', 'Stubborn', 'Reserved emotions'],
      careers: ['Technician', 'Engineer', 'Athlete', 'Mechanic']
    }
  },
  'ISFP': {
    ko: {
      title: '호기심 많은 예술가',
      description: '자유로운 영혼을 가진 예술가입니다.',
      strengths: ['창의성', '적응력', '감수성', '충실성'],
      weaknesses: ['경쟁 회피', '미루기', '스트레스에 약함'],
      careers: ['예술가', '디자이너', '음악가', '요리사']
    },
    en: {
      title: 'Adventurer',
      description: 'Flexible and charming artists, always ready to explore and experience something new.',
      strengths: ['Creative', 'Adaptable', 'Sensitive', 'Loyal'],
      weaknesses: ['Competitive avoidance', 'Procrastination', 'Stress sensitive'],
      careers: ['Artist', 'Designer', 'Musician', 'Chef']
    }
  },
  'INFP': {
    ko: {
      title: '열정적인 중재자',
      description: '이상적인 세상을 추구하는 낭만적인 이상주의자입니다.',
      strengths: ['창의성', '공감능력', '적응력', '이상주의'],
      weaknesses: ['현실감각 부족', '감정적', '우유부단함'],
      careers: ['작가', '심리상담사', '예술가', '교사']
    },
    en: {
      title: 'Mediator',
      description: 'Poetic, kind and altruistic people, always eager to help a good cause.',
      strengths: ['Creativity', 'Empathy', 'Adaptability', 'Idealism'],
      weaknesses: ['Unrealistic', 'Emotional', 'Indecisive'],
      careers: ['Writer', 'Psychologist', 'Artist', 'Teacher']
    }
  },
  'INTP': {
    ko: {
      title: '논리적인 사색가',
      description: '끊임없이 새로운 지식을 탐구하는 혁신적인 발명가입니다.',
      strengths: ['논리적 사고', '창의성', '객관성', '적응력'],
      weaknesses: ['과도한 분석', '우유부단함', '실용성 부족'],
      careers: ['프로그래머', '철학자', '수학자', '분석가']
    },
    en: {
      title: 'Logician',
      description: 'Innovative inventors with an unquenchable thirst for knowledge.',
      strengths: ['Logical thinking', 'Creativity', 'Objectivity', 'Adaptability'],
      weaknesses: ['Over-analysis', 'Indecisive', 'Impractical'],
      careers: ['Programmer', 'Philosopher', 'Mathematician', 'Analyst']
    }
  },
  'ESTP': {
    ko: {
      title: '모험을 즐기는 사업가',
      description: '위험을 즐기는 행동가입니다.',
      strengths: ['대담성', '적응력', '실용성', '활력'],
      weaknesses: ['인내심 부족', '위험 감수', '계획성 부족'],
      careers: ['기업가', '영업직', '운동선수', '경찰']
    },
    en: {
      title: 'Entrepreneur',
      description: 'Smart, energetic and very perceptive people, who truly enjoy living on the edge.',
      strengths: ['Bold', 'Adaptable', 'Practical', 'Energetic'],
      weaknesses: ['Impatient', 'Risk-prone', 'Unstructured'],
      careers: ['Entrepreneur', 'Sales', 'Athlete', 'Police officer']
    }
  },
  'ESFP': {
    ko: {
      title: '자유로운 영혼의 연예인',
      description: '즉흥적이고 열정적인 연예인입니다.',
      strengths: ['열정', '친화력', '적응력', '창의성'],
      weaknesses: ['집중력 부족', '계획성 부족', '갈등 회피'],
      careers: ['연예인', '영업직', '이벤트 기획자', '호텔리어']
    },
    en: {
      title: 'Entertainer',
      description: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
      strengths: ['Passionate', 'Friendly', 'Adaptable', 'Creative'],
      weaknesses: ['Unfocused', 'Disorganized', 'Conflict avoidant'],
      careers: ['Entertainer', 'Sales', 'Event planner', 'Hospitality']
    }
  },
  'ENFP': {
    ko: {
      title: '재기발랄한 활동가',
      description: '열정적이고 창의적인 자유로운 영혼입니다.',
      strengths: ['창의성', '열정', '적응력', '친화력'],
      weaknesses: ['집중력 부족', '현실감각 부족', '조직력 부족'],
      careers: ['예술가', '작가', '연예인', '마케터']
    },
    en: {
      title: 'Campaigner',
      description: 'Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
      strengths: ['Creativity', 'Enthusiasm', 'Adaptability', 'People skills'],
      weaknesses: ['Unfocused', 'Unrealistic', 'Disorganized'],
      careers: ['Artist', 'Writer', 'Entertainer', 'Marketer']
    }
  },
  'ENTP': {
    ko: {
      title: '뜨거운 논쟁을 즐기는 변론가',
      description: '지적 도전을 즐기며 창의적인 문제 해결사입니다.',
      strengths: ['창의성', '적응력', '논리력', '순발력'],
      weaknesses: ['논쟁적', '집중력 부족', '규칙 무시'],
      careers: ['기업가', '변호사', '발명가', '마케터']
    },
    en: {
      title: 'Debater',
      description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
      strengths: ['Creativity', 'Adaptability', 'Logic', 'Quick thinking'],
      weaknesses: ['Argumentative', 'Unfocused', 'Disregards rules'],
      careers: ['Entrepreneur', 'Lawyer', 'Inventor', 'Marketer']
    }
  },
  'ESTJ': {
    ko: {
      title: '엄격한 관리자',
      description: '사실적이고 실용적인 관리자입니다.',
      strengths: ['체계성', '리더십', '책임감', '효율성'],
      weaknesses: ['융통성 부족', '감정 둔감', '독단적'],
      careers: ['관리자', '군인', '판사', '경영자']
    },
    en: {
      title: 'Executive',
      description: 'Excellent administrators, unsurpassed at managing things – or people.',
      strengths: ['Organized', 'Leadership', 'Dedicated', 'Efficient'],
      weaknesses: ['Inflexible', 'Insensitive', 'Authoritarian'],
      careers: ['Manager', 'Military officer', 'Judge', 'Executive']
    }
  },
  'ESFJ': {
    ko: {
      title: '사교적인 외교관',
      description: '타인을 돕는 것을 좋아하는 사교적인 조력자입니다.',
      strengths: ['협동심', '신뢰성', '봉사정신', '실용성'],
      weaknesses: ['비판에 민감', '주목 필요', '융통성 부족'],
      careers: ['교사', '간호사', '상담사', '영업직']
    },
    en: {
      title: 'Consul',
      description: 'Extraordinarily caring, social and popular people, always eager to help.',
      strengths: ['Cooperative', 'Reliable', 'Supportive', 'Practical'],
      weaknesses: ['Sensitive to criticism', 'Needy', 'Inflexible'],
      careers: ['Teacher', 'Nurse', 'Counselor', 'Sales representative']
    }
  },
  'ENFJ': {
    ko: {
      title: '정의로운 사회운동가',
      description: '카리스마 있는 리더십으로 타인을 이끄는 이상주의자입니다.',
      strengths: ['리더십', '공감능력', '소통능력', '영향력'],
      weaknesses: ['과도한 이상주의', '과민반응', '완벽주의'],
      careers: ['교육자', '상담사', '인사관리자', '사회활동가']
    },
    en: {
      title: 'Protagonist',
      description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
      strengths: ['Leadership', 'Empathy', 'Communication', 'Influence'],
      weaknesses: ['Overly idealistic', 'Oversensitive', 'Perfectionist'],
      careers: ['Educator', 'Counselor', 'HR manager', 'Social activist']
    }
  },
  'ENTJ': {
    ko: {
      title: '대담한 통솔자',
      description: '카리스마 있는 리더십으로 목표를 달성하는 전략가입니다.',
      strengths: ['리더십', '결단력', '효율성', '전략적 사고'],
      weaknesses: ['참을성 부족', '완고함', '감정 표현 부족'],
      careers: ['경영자', 'CEO', '관리자', '컨설턴트']
    },
    en: {
      title: 'Commander',
      description: 'Bold, imaginative and strong-willed leaders, always finding a way – or making one.',
      strengths: ['Leadership', 'Determination', 'Efficiency', 'Strategic thinking'],
      weaknesses: ['Impatient', 'Stubborn', 'Emotionally reserved'],
      careers: ['Executive', 'CEO', 'Manager', 'Consultant']
    }
  }
};