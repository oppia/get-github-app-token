const core = require('@actions/core');
const utils = require('./utils');

async function main() {
  try {
    appId = core.getInput('app_id');
    privateKey = core.getInput('private_key');
    repository = process.env.GITHUB_REPOSITORY;

    const token = await utils.getToken(appId, privateKey, repository);
    core.setSecret(token);
    core.setOutput('token', token);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

main();
