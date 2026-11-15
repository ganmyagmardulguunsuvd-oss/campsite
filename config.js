// Supabase төслийнхөө мэдээллийг энд оруулна (Project Settings → API).
// anon key нь нийтэд ил байх зориулалттай түлхүүр. service_role түлхүүрийг ЭНД ХЭЗЭЭ Ч БҮҮ ТАВЬ.
window.APP_CONFIG = {
  SUPABASE_URL: 'https://qhdxnxxfcxsarczyncbf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_kqUPMlFntMjVHSAaWKDvQQ_FUsZ_rsx',

  // Премиум эрхийн үнэ, хугацаа (QPay холбогдох үед ашиглана)
  PREMIUM_PRICE: 9900,     // ₮
  PREMIUM_DAYS: 30,        // нэг удаа төлөхөд хэдэн хоног нээгдэх

  // Supabase тохируулаагүй үед премиумыг туршиж харах бол true болго (зөвхөн өөрийн компьютер дээр)
  DEMO_PREMIUM: false
};
