import passport from "passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

import { UserModel } from "../models/user.model";
import { getUserService } from "../services/user.service";

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
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    next: VerifyCallback
  ) => {
    const { email } = profile._json;
    const user = await getUserService({ email });
    if (user && (!user.username || !user.email || !user.fullName)) {
      return next(null, null);
    }

    return next(null, user); // Login the user
  };

  // Type 'true' is not assignable to type 'false' as StrategyOptions.passReqToCallback?: false
  return new Strategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL_FOR_LOGIN,
    },
    verify
  );
};

passport.use("google-login", googleSignupStrategy());
