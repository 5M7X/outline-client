// Copyright 2022 The Outline Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import download from 'download';
import { access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import url from 'url';
import { format } from 'util';

const jsignDirectoryPath = path.resolve('build/tmp');
const jsignFilename = 'jsign.jar';
const jsignVersion = '4.0';
const jsignDownloadUrl = 'https://github.com/ebourg/jsign/releases/download/%s/jsign-%s.jar';

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Download a specific version of jsign into the build temporary folder if not exists.
 */
export async function ensureJsignExists() {
  const jsignFullPath = path.resolve(jsignDirectoryPath, jsignFilename);
  if (await exists(jsignFullPath)) {
    console.info(`jsign already exists in "${jsignFullPath}"`);
    return;
  }

  const jsignUrl = format(jsignDownloadUrl, jsignVersion, jsignVersion);
  console.log(`downloading jsign from "${jsignUrl}" to "${jsignFullPath}"...`);
  await download(jsignUrl, jsignDirectoryPath, { filename: jsignFilename });
  console.info(`jsign version ${jsignVersion} downloaded to "${jsignFullPath}"`);
}

/**
 * Entry point called by node CLI.
 */
async function main() {
  await ensureJsignExists();
}

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  main();
}
