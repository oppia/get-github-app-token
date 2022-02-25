import * as core from '@actions/core';

import { getToken } from 'utils.js';

async function main() {
  try {
    appId = core.getInput('app_id');
    privateKey = core.getInput('private_key');
    repository = process.env.GITHUB_REPOSITORY;

    const token = getToken(appId, privateKey, repository);
    core.setSecret(token);
    core.setOutput('token', token);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

main();
