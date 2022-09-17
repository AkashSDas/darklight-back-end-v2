import { Request } from "express";
import passport from "passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import logger from "../logger";
import { SocialAuthProvider } from "../utils/user";

import { UserModel } from "../models/user.model";
import { createUser, getUser } from "../services/user.service";

passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser((_id, done) => {
  UserModel.findById(_id, function (err, user) {
    done(err, user);
  });
});

export const googleSignupStrategy = () => {
  const verify = async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    next: VerifyCallback
  ) => {
    const { email, sub, email_verified, picture } = profile._json;

    const user = await getUser({ email });
    if (user) return next(null, user); // Login the user

    // Signup the user
    let newUser = null;
    let err = null;
    try {
      newUser = await createUser({
        fullName: profile.displayName,
        email: email,
        emailVerified: email_verified == "true" ? true : false,
        profilePic: { id: "google", URL: picture },
        isActive: true,
        socialAuthInfo: [{ id: sub, provider: SocialAuthProvider.GOOGLE }],
      });
    } catch (error) {
      err = error;
      logger.error(error);
    }

    return next(err, newUser);
  };

  // Type 'true' is not assignable to type 'false' as StrategyOptions.passReqToCallback?: false
  return new Strategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      passReqToCallback: true as any,
    },
    verify
  );
};

passport.use("google-signup", googleSignupStrategy());
