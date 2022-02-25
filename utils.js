// Copyright 2022 U8NWXD
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const octokitApp = require('@octokit/app');

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
  const app = new octokitApp.App({
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

module.exports = { getToken };
