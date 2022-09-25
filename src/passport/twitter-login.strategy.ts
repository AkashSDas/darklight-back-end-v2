import passport from "passport";
import { Strategy, Profile } from "passport-twitter";

import { UserModel } from "../models/user.model";
import { getUserService } from "../services/user.service";
import { SocialAuthProvider } from "../utils/user";

passport.serializeUser((user, done) => {
  done(null, (user as any)._id);
});

passport.deserializeUser((_id, done) => {
  UserModel.findById(_id, function (err, user) {
    done(err, user);
  });
});

export const twitterLoginStrategy = () => {
  const verify = async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    next: any
  ) => {
    const { id } = profile._json;
    const user = await getUserService({
      socialAuthInfo: {
        $elemMatch: { id, provider: SocialAuthProvider.TWITTER },
      },
    });

    if (user && (!user.username || !user.email || !user.fullName)) {
      return next(null, null);
    }

    return next(null, user); // Login the user
  };

  return new Strategy(
    {
      consumerKey: process.env.TWITTER_OAUTH_CLIENT_KEY,
      consumerSecret: process.env.TWITTER_OAUTH_CLIENT_KEY_SECRET,
      callbackURL: process.env.TWITTER_OAUTH_CALLBACK_URL_FOR_LOGIN,
      includeEmail: true,
    },
    verify
  );
};

passport.use("twitter-login", twitterLoginStrategy());
