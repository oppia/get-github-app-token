import { App } from '@octokit/app'

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
