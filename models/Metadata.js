import fs from 'node:fs';
import path from 'node:path';
import { AppError } from '../utils/AppError.js';

class Metadata {
  // Prepare metadata
  #metadataFilePath;
  #json;
  #metadata;
  #length;

  static #instance;

  constructor() {
    this.#metadataFilePath = path.join(process.cwd(), 'metadata/versions.json');
    this.#json = fs.readFileSync(this.#metadataFilePath);
    this.#metadata = JSON.parse(this.#json).versions;

    this.#length = this.#metadata.length;
    this.#metadata.forEach(versionMetadata => {
      const domainName = process.env.DOMAIN_NAME;
      const downloadsPort = process.env.DOWNLOADS_PORT;

      versionMetadata.downloadUrl = `https://${domainName}:${downloadsPort}/apks/${versionMetadata.version}`;
    });
  }

  static getInstance() {
    if (this.#instance) return this.#instance;
    else return (this.#instance = new Metadata());
  }

  // Getting metadata
  getVersionMetadataI(index) {
    const versionMetadata = this.#metadata[index];

    if (!versionMetadata) throw new AppError('Version not found', 404);

    return versionMetadata;
  }

  getVersionMetadata(version) {
    const versionMetadata = this.#metadata.find(el => el.version == version);

    if (!versionMetadata) throw new AppError('Version not found', 404);

    return versionMetadata;
  }

  getLatestVersionMetadata() {
    return this.getVersionMetadataI(this.#length - 1);
  }

  // TODO: Adding metadata
  // TODO: Forcing data structure reload if json file is updated directly
  // TODO: Use a database instead of a JSON file. This introduces complexity but simplifies the API (the previous two TODOs will be redundant)
}

export default Metadata;
