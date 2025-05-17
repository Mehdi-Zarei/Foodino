import { RequestHandler, Request } from "express";
import { userModel, IUser } from "../models/User";
import { getData, getOtpInfo, removeData, saveData } from "../utils/redis";
import sentSms from "../Service/sentSms";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { compareData, hashData } from "../utils/bcryptjs";

interface CustomRequest extends Request {
  user?: IUser;
}

export const sentOtp: RequestHandler = async (req, res, next) => {
  try {
    const { phone } = req.body;

    const isUserRestrict = await userModel.findOne({ phone, isRestrict: true });

    if (isUserRestrict) {
      res
        .status(403)
        .json({ message: "حساب کاربری شما به علت تخلف مسدود شده است." });
      return;
    }

    const { remainingTime, expired } = await getOtpInfo(phone);

    if (!expired) {
      res.status(403).json({
        message: `کد یکبارمصرف قبلا برای شما ارسال گردیده است.لطفا پس از ${remainingTime} مجدد تلاش کنید.`,
      });
      return;
    }

    const generateOtpCode =
      Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

    await saveData(`otp:${phone}`, generateOtpCode, 60);

    const smsResult = await sentSms(
      phone,
      process.env.OTP_PATTERN!,
      process.env.OTP_VARIABLE!,
      generateOtpCode
    );

    if (smsResult.success) {
      res.status(200).json({
        message: "کد یکبار مصرف با موفقیت ارسال گردید.",
        data: generateOtpCode,
      });
      return;
    } else {
      res.status(500).json({
        message: "خطا در ارسال کد یکبار مصرف،لطفا مجدد تلاش فرمائید.",
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const verifyOtp: RequestHandler = async (req, res, next) => {
  try {
    const { code, phone } = req.body;

    const storedOtp = await getData(`otp:${phone}`);

    if (!storedOtp || storedOtp !== code) {
      res.status(403).json({
        message:
          "کد وارد شده صحیح نمی باشد و یا مدت زمان آن به پایان رسیده است.",
      });
      return;
    }

    const isUserExist = await userModel.findOne({ phone });

    if (isUserExist) {
      const accessToken = await generateAccessToken(
        isUserExist._id,
        isUserExist.role
      );

      const refreshToken = await generateRefreshToken(isUserExist._id);

      const hashRefreshToken = await hashData(refreshToken);

      await saveData(
        `refreshToken:${isUserExist._id}`,
        hashRefreshToken,
        parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_SECOND!)
      );

      res.status(200).json({
        message: "با موفقیت وارد حساب کاربری خود شدید",
        data: { accessToken, refreshToken },
      });

      await removeData(`otp:${phone}`);
      return;
    }
    res.status(200).json({ message: "Redirect To Register Page." });
    return;
  } catch (error) {
    next(error);
  }
};

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, phone, password, addresses, favorites } = req.body;

    const isUserExist = await userModel.findOne({ phone });

    if (isUserExist) {
      res.status(409).json({ message: "شماره موبایل تکراری می باشد." });
      return;
    }

    const isFirstUser = !!userModel.countDocuments();
    const newUser = new userModel<IUser>({
      name,
      email,
      phone,
      addresses,
      favorites,
      isRestrict: false,
      role: isFirstUser ? "ADMIN" : "USER",
    });

    if (password) {
      const hashedPassword = await hashData(password);
      newUser.password = hashedPassword;
    }

    await newUser.save();

    const accessToken = await generateAccessToken(newUser._id, newUser.role);
    const refreshToken = await generateRefreshToken(newUser._id);
    const hashRefreshToken = await hashData(refreshToken);
    await saveData(
      `refreshToken:${newUser._id}`,
      hashRefreshToken,
      parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_SECOND!)
    );

    res.status(201).json({
      message: "حساب کاربری با موفقیت ایجاد گردید.",
      refreshToken,
      accessToken,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const isUserExist = await userModel.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    });

    if (!isUserExist) {
      res.status(404).json({ message: "اطلاعات وارد شده صحیح نمی باشد." });
      return;
    }

    if (!isUserExist.password) {
      res.status(404).json({
        message:
          "برای ورود ابتدا باید رمز عبور تنظیم کنید. لطفاً از طریق کد یکبارمصرف وارد حساب کاربری خود شویدو از طریق پروفایل خود یک رمز عبور تعیین کنید.",
      });
      return;
    }

    const comparePassword = await compareData(password, isUserExist.password);

    if (!comparePassword) {
      res
        .status(403)
        .json({ message: "نام کاربری یا رمز عبور اشتباه می باشد." });
      return;
    }

    const accessToken = await generateAccessToken(
      isUserExist._id,
      isUserExist.role
    );
    const refreshToken = await generateRefreshToken(isUserExist.id);
    const hashRefreshToken = await hashData(refreshToken);
    await saveData(
      `refreshToken:${isUserExist._id}`,
      hashRefreshToken,
      parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_SECOND!)
    );

    res.status(200).json({
      message: "با موفقیت وارد حساب کاربری خود شدید.",
      accessToken,
      refreshToken,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const user = (req as CustomRequest).user;

    await removeData(`refreshToken:${(user as any)._id}`);

    res
      .status(200)
      .json({ message: "شما با موفقیت از حساب کاربری خود خارج شدید." });
  } catch (error) {
    next(error);
  }
};
