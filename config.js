// Supabase төслийнхөө мэдээллийг энд оруулна (Project Settings → API).
// anon/publishable key нь нийтэд ил байх зориулалттай. service_role/secret түлхүүрийг ЭНД ХЭЗЭЭ Ч БҮҮ ТАВЬ.
window.APP_CONFIG = {
  SUPABASE_URL: 'https://qhdxnxxfcxsarczyncbf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_kqUPMlFntMjVHSAaWKDvQQ_FUsZ_rsx',

  // Премиум эрхийн үнэ, хугацаа
  PREMIUM_PRICE: 4900,     // ₮
  PREMIUM_DAYS: 30,        // нэг удаа төлөхөд хэдэн хоног нээгдэх

  // Төлбөр хүлээн авах данс (хэрэглэгчдэд харагдана)
  BANK_NAME: 'Golomt bank',           // жишээ: 'Хаан банк'
  BANK_ACCOUNT: '64001500 3665163045',        // дансны дугаар эсвэл IBAN
  BANK_HOLDER: 'Ганмягмар Дөлгөөнсувд',         // данс эзэмшигчийн нэр
  BANK_QR_IMAGE: 'qr.png', // банкны апп-ын "Миний QR" зураг
  CONTACT: '95551726',             // асуух зүйл гарвал холбогдох утас/FB, жишээ: '9911xxxx'

  // Supabase тохируулаагүй үед премиумыг туршиж харах бол true болго (зөвхөн өөрийн компьютер дээр)
  DEMO_PREMIUM: false
};
