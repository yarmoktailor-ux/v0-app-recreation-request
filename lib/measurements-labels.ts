// Arabic labels for measurements and details
export const measurementLabels: Record<string, string> = {
  // Measurements
  length: 'الطول',
  shoulder: 'الكتف',
  sleeveLength: 'طول اليد',
  chest: 'وسع الصدر',
  neck: 'الرقبة',
  sleeveMiddle: 'وسط اليد',
  cuffLength: 'طول الكبك',
  stepWidth: 'وسع الخطوة',
  cuffWidth: 'عرض الكفة',
  
  // Additional measurements
  waist: 'الوسط',
  hp: 'الورك',
  moda: 'مودا',
  bottomWidth: 'وسع أسفل',
  bottomCuff: 'كفة أسفل',
  jointS: 'مفصل س',
  jointK: 'مفصل ك',
  cuffS: 'كبك س',
  cuffK: 'كبك ك',
  sleeveS: 'كم س',
  sleeveK: 'كم ك',
}

export const detailLabels: Record<string, string> = {
  // Zipper
  zipper: 'السحاب',
  zipperHidden: 'مخفي',
  zipperVisible: 'ظاهر',
  
  // Pocket
  pocket: 'الجيب',
  pocketSquare: 'مربع',
  pocketNormal: 'عادي',
  pocketQatari: 'قطري',
  pocketManager: 'مدير',
  noPocket: 'بدون جيب',
  
  // Neck Type
  neckType: 'نوع الرقبة',
  neckSquare: 'مربعة',
  neckRound: 'دائرية',
  neckV: 'V شكل',
  
  // Neck Option
  neckOption: 'خيار الرقبة',
  neckPlain: 'عادية',
  neckSingle: 'خيط واحد',
  neckDouble: 'خيطان',
  
  // Cuff Mid
  cuffMid: 'وسط الكبك',
  cuffMidPlain: 'عادي',
  cuffMidFrench: 'فرنسي',
  
  // Cuff Design Option
  cuffDesignOpt: 'خيار تصميم الكبك',
  cuffDesignNoWoven: 'كيك مقلوب بدون خيوط',
  cuffDesignWoven: 'كيك مقلوب مع خيوط',
  cuffDesignRegular: 'كيك عادي',
  
  // Placket (الرجل/البلاكيت)
  placket: 'البلاكيت',
  placketHidden: 'مخفي',
  placketVisible: 'ظاهر',
  
  // Collar
  collar: 'الياقة',
  collarSpread: 'منفرجة',
  collarPoint: 'مدببة',
  collarButton: 'بأزرار',
}

export function getMeasurementLabel(key: string): string {
  return measurementLabels[key] || key
}

export function getDetailLabel(key: string): string {
  return detailLabels[key] || key
}
