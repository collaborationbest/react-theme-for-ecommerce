import { redirect } from "react-router-dom";
import customFetch from "../axios/custom";
import CryptoJS from 'crypto-js';


interface SearchActionRequest {
  request: {
    formData: () => Promise<FormData>;
  };
}

interface CheckoutFormAction {
  request: {
    formData: () => Promise<FormData>;
  };
}

export const searchAction = async ({ request }: SearchActionRequest) => {
  // getting form data
  const formData = await request.formData();
  // converting form data to object for easy access
  const data = Object.fromEntries(formData);

  return redirect(`/search?query=${data?.searchInput || ""}`);
};


export const checkoutAction = async ({request} : CheckoutFormAction) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await customFetch.post("/orders", data);
  return redirect('/');
}


export const decryptData = (encryptedData: string, secretKey: string): string => {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('secret error');
    }

    const iv = CryptoJS.enc.Base64.parse(parts[0]);
    const ciphertext = parts[1];

    const key = CryptoJS.enc.Utf8.parse(secretKey);

    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return 'failed';
  }
};
