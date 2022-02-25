# `get-github-app-token`: Retrieve Auth Token for GitHub App

[GitHub Apps](https://docs.github.com/apps) can be assigned more
granular permissions than personal access tokens (PATs), but
authenticating as a GitHub App is more complicated than just using a
PAT. The authentication process works like this:

1. You download a private key for your app from GitHub.
2. You use that private key to sign a JSON Web Token (JWT) and present
   that JWT to GitHub to retrieve an installation token.
3. Use that installation token to authenticate API calls to GitHub, for
   example to operate on repositories.

For more details, see [GitHub's
documentation](https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps).

`get-github-app-token` simplifies using GitHub Apps in GitHub Actions
workflows by handling step 2 for you. You put your GitHub App's ID and
private key into your repository's secrets. Then in your workflow, you
use `get-github-app-token` to get an installation token that you can use
later in your workflow.

Note that your GitHub App must be installed on the repository you want
to perform privileged operations on.

## Usage on GitHub Actions

You can use this action in a GitHub Actions workflow like this:

```yml
  - name: Retrieve token
    id: get-token
    uses: U8NWXD/get-github-app-token
    with:
      app_id: ${{ secrets.APP_ID }}
      private_key: ${{ secrets.APP_PRIVATE_KEY }}
  - name: Checkout private repository
    uses: actions/checkout@v2
    with:
      repository: user/my-private-repo
      token: ${{ steps.get-token.outputs.token }}
```

## Demo

To test out this GitHub Action, create a GitHub app and install it on a
repository. Then download its private key and save the file as
`privateKey.pem`. Then create a `demo.js` file with the following
content:

```js
const fs = require('fs');
const utils = require('./utils');

async function main() {
  const privateKey = (await fs.promises.readFile('privateKey.pem')).toString();

  const token = await utils.getToken(
    '<YOUR APP ID>',
    privateKey,
    '<YOUR USER NAME>/<YOUR REPOSITORY NAME>');
  console.log(token);
}

main();
```

Then when you run `node demo.js` you should see a token printed that
starts with `ghs_`.
