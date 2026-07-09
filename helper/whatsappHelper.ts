/**
 * Generate WhatsApp URL with encoded message
 * @param message - The message to send
 * @param phone - Phone number (optional, defaults to admin number)
 * @returns WhatsApp URL
 */
export const generateWhatsAppUrl = (message: string, phone: string = "6281214690096"): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
};

/**
 * Open WhatsApp with pre-filled message
 * @param message - The message to send
 * @param phone - Phone number (optional, defaults to admin number)
 */
export const openWhatsApp = (message: string, phone: string = "6281214690096"): void => {
  const url = generateWhatsAppUrl(message, phone);
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Pre-defined messages for common use cases
 */
export const WhatsAppMessages = {
  KYC_VERIFICATION: "Halo Admin 👋\nSaya ingin melakukan verifikasi KYC di OXO",
  WITHDRAWAL_INQUIRY: "Halo Admin 👋\nSaya ingin menanyakan tentang withdrawal request saya",
  GENERAL_INQUIRY: "Halo Admin 👋\nSaya ingin bertanya tentang OXO Exchange",
  TECHNICAL_SUPPORT: "Halo Admin 👋\nSaya mengalami masalah teknis di OXO Exchange",
  ACCOUNT_ISSUE: "Halo Admin 👋\nSaya mengalami masalah dengan akun saya di OXO Exchange"
} as const;

/**
 * Open WhatsApp with pre-defined message
 * @param messageType - Type of pre-defined message
 * @param phone - Phone number (optional, defaults to admin number)
 */
export const openWhatsAppWithMessage = (
  messageType: keyof typeof WhatsAppMessages,
  phone: string = "6281214690096"
): void => {
  const message = WhatsAppMessages[messageType];
  openWhatsApp(message, phone);
};

/**
 * Create custom WhatsApp message with user info
 * @param baseMessage - Base message template
 * @param userInfo - Additional user information to include
 * @returns Formatted message
 */
export const createCustomMessage = (
  baseMessage: string,
  userInfo?: {
    email?: string;
    name?: string;
  }
): string => {
  let message = baseMessage;
  
  if (userInfo) {
    const userDetails: string[] = [];
    if (userInfo.name) userDetails.push(`Nama: ${userInfo.name}`);
    if (userInfo.email) userDetails.push(`Email: ${userInfo.email}`);
    
    if (userDetails.length > 0) {
      message += `\n\nDetail User:\n${userDetails.join('\n')}`;
    }
  }
  
  return message;
};
