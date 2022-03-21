const cloudinary = require('cloudinary').v2;
const path = require('path');
const config = require(path.resolve("config.js"));
const { cloudinary_apiKey, cloudinary_api_secret, cloudinary_cloud_name } = config;

/**
 * @description: cloudinary service
 * @param {object} config - cloudinary config
 * @author Remilekun Elijah
 */
class Cloud {
    constructor(configs = {}) {
        this._cloud_name = configs._cloud_name || cloudinary_cloud_name;
        this._api_key = configs.api_key || cloudinary_apiKey;
        this._api_secret = configs.api_secret || cloudinary_api_secret;
        this._secure = configs._secure || true;
        this._folder = configs.folder || 'easyfood';
        this._type = configs.type || "authenticated";
        this.sign_url = this._type == "authenticated" ? true : false;
    }

    _config() {
            cloudinary.config({ cloud_name: this._cloud_name, api_key: this._api_key, api_secret: this._api_secret, secure: this._secure });
            return cloudinary;
        }
        /**
         * 
         * @param {String} path - path to the file to be uploaded
         * @param {Object} options - cloudinary options
         * @returns the uploaded item information
         */
    upload(img, options = {}) {
        options.public_id = options.public_id || `${path.basename(img).split('.')[0]}`;
        options.folder = options.folder || this._folder;
        options.type = options.type || this._type;

        const res = this._config().uploader.upload(img, options, (err, result) => {
            if (err) throw err;
            else return result;
        });

        return res;
    }

    async delete(public_id, options = {}) {
            options.type = options.type || this.type;
            options.sign_url = options.sign_url || this.sign_url;
            options.resource_type = options.resource_type || 'image';
            // let folder = options.folder || this._folder;
            options.invalidate = options.invalidate || true;

            const res = this._config().api.delete_resources(public_id, options, (err, res) => {
                console.log(res, err);
                if (err) throw err;
                else return res;
            });

            return res;
        }
        /**
         * 
         * @param {string} public_id - image public_id
         * @param {object} options - cloudinary options
         * @returns returns the updated item
         */
    update(file, options = {}) {
        options.overwrite = true;
        options.invalidate = true;
        options.type = options.type || this._type;
        const res = this._config().uploader.upload(file, options, (err, result) => {
            if (err) throw err;
            else return result;
        });
        return res
    }

    get(public_id, options = {}) {
        // options.folder = options.folder || this._folder;
        options.type = options.type || this._type;
        options.sign_url = options.sign_url || this.sign_url;

        return this._config().url(public_id, options);
    }

}

module.exports = Cloud;