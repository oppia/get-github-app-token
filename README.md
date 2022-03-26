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
    uses: oppia/get-github-app-token@release-v0.0.1
    with:
      app_id: ${{ secrets.APP_ID }}
      private_key: ${{ secrets.APP_PRIVATE_KEY }}
  - name: Checkout private repository
    uses: actions/checkout@v2
    with:
      repository: user/my-private-repo
      token: ${{ steps.get-token.outputs.token }}
```

**Note that you MUST specify a release branch after `@` on the `uses:`
line. The `main` branch does not contain the bundled distribution files
that GitHub Actions
[requires](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#commit-tag-and-push-your-action-to-github).
Tags like `v0.0.1` live on the `main` branch and so also lack the
bundled distribution files. These files are only present on the release
branches.**

Because we rely on release branches to keep the distribution files out
of the `main` branch, you cannot specify major or major-minor version
numbers (e.g. `v1` or `v1.1`). Instead, you must specify a full version
number (e.g. `v1.0.1`) as part of the release branch name (e.g.
`release-v1.0.1`). Alternatively, you can specify a commit hash.


## Developing

### Set Up

Setting up the project is as easy as running `yarn install` to install
the dependencies.

### Demo

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

### Create a New Release

To create a new release, you need to first:

* Make sure you have all your changes in the `main` branch. This
  includes updates to the version number in `package.json`.
* Pick a version number. We follow semantic versioning.
* Checkout the `main` branch and run the release script with your
  version number (in this example `v0.0.1`):

  ```console
  $ ./release.sh 0.0.1
  ...
  ```

The `release.sh` script takes care of everything else for you. It:

* Runs some simple checks to make sure you remembered to update the
  `package.json` version and that you have a clean working directory.
* Creates a new version tag on `main` and pushes it.
* Creates a new distribution with `yarn dist`. This command creates a
  bundled `dist/index.json` file with all the dependencies, and it
  copies over `action.yml` into `dist/`.
* Creates a new git repository in `dist` and pushes the contents to the
  release branch. Note that this means that we do not expect to track
  commit history on the release branches. Each branch will have just one
  commit with the distribution files.
