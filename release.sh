# Copyright 2022 U8NWXD
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Create and publish a new version by creating and pushing a git tag for
# the version. Also perform some basic checks to avoid mistakes in
# releases, for example tags not matching packages.json.

# Usage: ./release.sh 0.0.1

set -e

RELEASE_REMOTE="git@github.com:U8NWXD/get-github-app-token"

version="$1"

# Check version is valid
package_json_version=$(node -e "
    const fs = require('fs');
    fs.readFile('./package.json', (err, data) =>
        console.log(JSON.parse(data).version))
")
if [ "$package_json_version" != "$version" ]; then
    echo "package.json has version $package_json_version, not $version."
    echo "Aborting."
    exit 1
fi

# Check working directory is clean
if [ ! -z "$(git status --untracked-files=no --porcelain)" ]; then
    echo "You have changes that have yet to be committed."
    echo "Aborting."
    exit 1
fi

# Check that we are on the main branch
branch="$(git rev-parse --abbrev-ref HEAD)"
if [ "$branch" != "main" ]; then
    echo "You are on $branch but should be on main for releases."
    echo "Aborting."
    exit 1
fi

# Create and push git tag
git tag -m "Version v$version" "v$version"
git push --tags

# Create and deploy package
rm -rf dist
yarn dist
git -C dist/ init
git -C dist/ add -A
git -C dist/ commit -m "Release version v$version"
branch="release-v$version"
git -C dist/ checkout -b "$branch"
git -C dist/ push -f "$RELEASE_REMOTE" "$branch"

echo "Version v$version has been tagged and pushed to branch $branch"
