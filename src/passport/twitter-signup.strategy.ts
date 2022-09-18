import { Request } from "express";
import passport from "passport";
import logger from "../logger";
import { SocialAuthProvider } from "../utils/user";
import { Strategy, Profile } from "passport-twitter";

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

export const twitterSignupStrategy = () => {
  const verify = async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    next: any
  ) => {
    const { id, name, email, profile_image_url } = profile._json;
    const user = await getUser({ email });
    if (user) return next(null, user); // Login the user

    // Signup the user
    let newUser = null;
    let err = null;
    try {
      // If no email then user will verify it from app's settings
      newUser = await createUser({
        fullName: name,
        email: email ?? undefined,
        emailVerified: email ? true : false,
        profilePic: profile_image_url
          ? { id: "twitter", URL: profile_image_url }
          : null,
        isActive: email ? true : false,
        socialAuthInfo: [{ id: id, provider: SocialAuthProvider.TWITTER }],
      });
    } catch (error) {
      err = error;
      logger.error(error);
    }

    return next(err, newUser);
  };

  return new Strategy(
    {
      consumerKey: process.env.TWITTER_OAUTH_CLIENT_KEY,
      consumerSecret: process.env.TWITTER_OAUTH_CLIENT_KEY_SECRET,
      callbackURL: process.env.TWITTER_OAUTH_CALLBACK_URL,
      passReqToCallback: true,
      includeEmail: true,
    },
    verify
  );
};

passport.use("twitter-signup", twitterSignupStrategy());
