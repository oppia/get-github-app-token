import { App } from '@octokit/app'

/**
 * Retrieve an authentication token for a GitHub App.
 *
 * @param {string} appId - The GitHub App's ID, which you can retrieve
 * from your app's settings page.
 * @param {string} privateKey - The GitHub App's private key, which you
 * can download from GitHub. This argument should be a string of the
 * file contents. Note that GitHub should generate a PEM file for you.
 * @param {string} repository - The repository owner and name, separated
 * by a slash. For example: "user/repository".
 */
async function getToken(appId, privateKey, repository) {
  const app = new App({
    appId: appId,
    privateKey: privateKey,
  });

  const slashIndex = repository.indexOf('/');
  const installation = await app.octokit.request('GET /repos/{owner}/{repo}/installation', {
    owner: repository.slice(0, slashIndex),
    repo: repository.slice(slashIndex + 1),
  })
  const resp = await app.octokit.auth({
    type: 'installation',
    installationId: installation.data.id,
  });

  if (!resp) {
    throw new Error('Unable to authenticate');
  }
  return resp.token;
}

export { getToken };
