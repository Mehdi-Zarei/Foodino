import axios from "axios";

const sentSms = async (
  userPhone: string,
  smsPattern: string,
  smsVariable: string,
  data: number
) => {
  try {
    const response = await axios.post("http://ippanel.com/api/select", {
      op: "pattern",
      user: process.env.OTP_USER,
      pass: process.env.OTP_PASS,
      fromNum: "3000505",
      toNum: userPhone,
      patternCode: smsPattern,
      inputData: [{ [smsVariable]: data }],
    });

    if (Array.isArray(response.data)) {
      console.log("SMS Error Body -->", response.data);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("SMS Error -->", error);
    return { success: false };
  }
};

export default sentSms;
