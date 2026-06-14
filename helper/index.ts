import Cookies from "js-cookie";

export const getInitials = (input: string, max?: number): string => {
  return input
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word[0].toUpperCase())
    .slice(0, max)
    .join("");
};

export const toCamelCase = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "") // hapus karakter non-alfanumerik kecuali spasi
    .split(" ")
    .filter(Boolean)
    .map((word, index) => {
      if (index === 0) return word;
      return word[0].toUpperCase() + word.slice(1);
    })
    .join("");
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function unformatCurrency(input: string): number {
  const cleaned = input.replace(/[Rp.,\s]/g, "");
  return parseInt(cleaned, 10) || 0;
}

export function floatFormatNumber(input: string): {
  value: number;
  displayValue: string;
} {
  if (!input) return { value: 0, displayValue: "0" };

  const cleaned = input
    .replace(/[^0-9.,]/g, "") // Hapus semua kecuali angka, titik, koma
    .replace(/,/g, "."); // Ubah koma jadi titik

  let displayValue = cleaned;
  let value = 0;

  // Hapus leading zeros yang berlebih, tapi pertahankan jika hanya "0" atau "0."
  if (displayValue.length > 1) {
    // Jika dimulai dengan "00" atau lebih, hapus leading zeros kecuali satu terakhir
    if (displayValue.match(/^0{2,}/)) {
      displayValue = displayValue.replace(/^0+/, "0");
    }
    // Jika dimulai dengan "0" dan karakter selanjutnya bukan ".", hapus leading zero
    else if (displayValue.match(/^0[0-9]/)) {
      displayValue = displayValue.replace(/^0+/, "");
    }
  }

  // Jika ada trailing decimal point, preserve untuk display
  if (displayValue.endsWith(".")) {
    value = parseFloat(displayValue.slice(0, -1)) || 0;
    // displayValue sudah benar
  } else {
    value = parseFloat(displayValue);
    if (isNaN(value)) {
      value = 0;
      displayValue = "0";
    }
    // displayValue sudah benar
  }

  return { value, displayValue };
}

export const maskName = (input: string): string => {
  const exceptions = ["Sdr.", "Tn.", "Ny."];

  return input
    .split(" ")
    .map((word) => {
      if (exceptions.includes(word)) return word;
      if (word.length <= 2) return word; // terlalu pendek untuk diproses

      const first = word[0];
      const last = word[word.length - 1];
      const middle = "*".repeat(word.length - 2);
      return first + middle + last;
    })
    .join(" ");
};

export const maskBankAccountNumber = (input: string): string => {
  const digitsOnly = input.replace(/\D/g, "");
  const lastFour = digitsOnly.slice(-4);
  const masked = "*".repeat(Math.max(0, digitsOnly.length - 4)) + lastFour;
  return masked;
};

export const maskText = (
  input: string,
  start: number,
  last: number,
  maskText: string,
  totalMaskText: number
): string => {
  if (!input) return "";

  const cleanText = input.trim();
  const len = cleanText.length;

  if (start + last >= len) return cleanText;

  const startText = cleanText.slice(0, start);
  const lastText = cleanText.slice(len - last);
  const maskedSection = maskText.repeat(totalMaskText);

  return `${startText}${maskedSection}${lastText}`;
};

export function generateTransactionId(digitLength: number = 8): string {
  if (digitLength <= 0) {
    throw new Error("Digit length must be greater than 0");
  }

  const randomDigits = Math.floor(Math.random() * Math.pow(10, digitLength))
    .toString()
    .padStart(digitLength, "0");

  return `TX-${randomDigits}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function formatTokenAmount(
  amount: string,
  decimals: number = 6
): string {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
  }).format(numAmount);
}

export function formatTokenAmountWithoutRounding(
  amount: string,
  decimals: number = 6
): string {
  const [int, dec = ""] = amount.split(".");
  const formattedInt = Number(int).toLocaleString("en-US");
  
  if (decimals === 0) return formattedInt;

  const trimmedDec = dec.slice(0, decimals);

  return trimmedDec ? `${formattedInt}.${trimmedDec}` : formattedInt;
}

type TimeUnit = "seconds" | "minutes" | "hours" | "days" | "months" | "years";

export function setCookieWithExpiry(
  name: string,
  value: string,
  amount: number,
  unit: TimeUnit
) {
  const now = new Date();

  switch (unit) {
    case "seconds":
      now.setSeconds(now.getSeconds() + amount);
      break;
    case "minutes":
      now.setMinutes(now.getMinutes() + amount);
      break;
    case "hours":
      now.setHours(now.getHours() + amount);
      break;
    case "days":
      now.setDate(now.getDate() + amount);
      break;
    case "months":
      now.setMonth(now.getMonth() + amount);
      break;
    case "years":
      now.setFullYear(now.getFullYear() + amount);
      break;
    default:
      throw new Error("Invalid time unit");
  }

  Cookies.set(name, value, { expires: now, path: "/", secure: true, sameSite: "none" });
}

export const formatRupiah = (value: number, withPrefix = true): string => {
  if (isNaN(value)) return "0";

  return (
    (withPrefix ? "Rp " : "") +
    value
      .toFixed(0) // bulatkan ke 0 desimal
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
};

export function formatInputRupiah(angka: string, prefix?: string) {
  const numberString = angka.replace(/[^,\d]/g, '').toString();
  const split = numberString.split(',');
  const sisa = split[0].length % 3;
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
  let rupiah = split[0].substr(0, sisa);

  if (ribuan) {
    const separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix === undefined ? rupiah : rupiah ? prefix + rupiah : '';
}

export function removeStringFormInt(
  value?: string,
  alowMinus?: boolean,
): number {
  if (!value) return 0;
  if (alowMinus) {
    const matches = value.match(/-?\d+/);
    if (!matches) return 0;

    const numericValue = Number(matches[0]);
    if (isNaN(numericValue)) return 0;

    return numericValue;
  }

  return Number(value?.replace(/\D/g, ''));
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("id-ID").format(value);
}