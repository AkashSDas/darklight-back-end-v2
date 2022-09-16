import { Request } from "express";
import passport from "passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

import { UserModel } from "../models/user.model";

passport.serializeUser((user, done) => {
  done(null, (user as any).email);
});

passport.deserializeUser((email, done) => {
  UserModel.findOne({ email }, function (err, user) {
    done(err, user);
  });
});

export const googleStrategy = () => {
  const verify = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    next: VerifyCallback
  ): void => {
    const { email, sub, email_verified, name, picture } = profile._json;
    const user = {
      provider: "google",
      provider_id: sub,
      email,
      emailVerified: email_verified,
      username: name,
      accessToken,
      profilePic: { id: "", URL: picture },
    };

    return next(null, user);
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

passport.use(googleStrategy());
