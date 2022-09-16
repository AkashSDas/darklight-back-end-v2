# darklight-back-end

## Social Auth

### Google

Create a new project in the [Google Developer Console](https://console.developers.google.com/). Then follow this path to go the oauth settings page: `Dashboard > APIs (Go to APIs overview)`. Here you will get settings like `OAuth consent screen` and `Credentials`.

Click on `OAuth consent screen` option. Choose `External`. Then fill the form which is about customizing the Google consent login form that will open when user will login to your app using Google. Once you save and continue the `OAuth consent screen` form, you'll get another form `Scopes`, in that add `Your non-sensitive scopes` as `/auth/userinfo/email` and `/auth/userinfo/profile` and then save and continue. After that you'll get forms viz `Test Users` and `Summary`, don't fill anything just click on Save and Continue. You consent screen is now ready.

Now go to the `Credentials` section. Click on `Create Credentials` and choose `OAuth client ID`. Choose `Web application` as the application type. Fill the form with the following details: `Authorized JavaScript origins` i.e. the front-end as `http://localhost:3000` and `Authorized redirect URIs` as `http://localhost:3000` (for the front-end) and `http://localhost:8002/api/social-auth/google/redirect` (for the back-end). Click on `Create` button. You'll get a client ID and client secret. Copy these values and paste them in the `.env` file.
