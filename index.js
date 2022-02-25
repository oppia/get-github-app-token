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
