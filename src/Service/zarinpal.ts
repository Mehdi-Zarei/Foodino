import axios from "axios";

const zarinpal = axios.create({
  baseURL: process.env.ZARINPAL_API_BASE_URL,
});

interface ICreatePaymentInput {
  amountInRial: number;
  description: string;
  mobile: string;
}

interface ICreatePaymentOutput {
  authority: string;
  paymentUrl: string;
}

interface IZarinpalRequestResponse {
  data: {
    authority: string;
    code: number;
    message: string;
  };
}

interface IVerifyPaymentInput {
  amountInRial: number;
  authority: string;
}

export const createPayment = async function ({
  amountInRial,
  description,
  mobile,
}: ICreatePaymentInput): Promise<ICreatePaymentOutput> {
  try {
    const response = await zarinpal.post<IZarinpalRequestResponse>(
      "/request.json",
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        callback_url: process.env.ZARINPAL_PAYMENT_CALLBACK_URL,
        amount: amountInRial,
        description,
        metadata: {
          mobile,
        },
      }
    );

    const data = response.data.data;

    return {
      authority: data.authority,
      paymentUrl: process.env.ZARINPAL_PAYMENT_BASE_URL + data.authority,
    };
  } catch (err: any) {
    console.log(err);
    throw new Error(err?.response?.data?.errors?.message || "Zarinpal error");
  }
};

export const verifyPayment = async function ({
  amountInRial,
  authority,
}: IVerifyPaymentInput): Promise<any> {
  try {
    const response = await zarinpal.post<IZarinpalRequestResponse>(
      "/verify.json",
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        amount: amountInRial,
        authority,
      },
      {
        validateStatus: (status) => status <= 500,
      }
    );

    return response.data.data;
  } catch (err: any) {
    console.log(err);
    throw new Error(err?.response?.data?.errors?.message || "Zarinpal error");
  }
};
