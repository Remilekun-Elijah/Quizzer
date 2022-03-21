// jshint esversion:6
const path = require("path");
fs = require("fs").promises;
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
module.exports = function(uploadedFiles, expectedFileTypes) {
    try {


        let img = [],
            pdfs = [],
            mp4 = [],
            mp3 = [],
            fileType = [],
            zips = [],
            docs = [],
            others = [],
            err = {},
            srts = [],
            xlsx = [],
            bin = [];

        const init = () => {
            /** Check if no file was uploaded **/
            if (uploadedFiles == undefined || uploadedFiles.length == 0) {
                /** Populate the error array with a message **/
                err.type = "EMPTY_FILE";
                err.message = "Error: You must upload a file";

            } else {

                /** find expected file in uploaded file **/
                uploadedFiles.find((file, uploadedFileindex) => {
                    /* gets the file type */
                    const type = path.extname(file.originalname).slice(1);
                    /* sets the file name */
                    if (type == "png" || type == "jpg" || type == "jpeg") file.type = "img";
                    else file.type = type;

                    /** Check if uploaded file matches expectcted file **/
                    if (expectedFileTypes.indexOf(file.type) != -1) {

                        /** Populate the fileType array with the uploaded file type **/
                        fileType.push(file.type);

                        /** check the uploaded file type and then split *
                         the file(s) in their respective array **/
                        switch (file.type) {
                            case 'pdf':
                                pdfs.push(file);
                                break;
                            case 'mp4':
                                mp4.push(file);
                                break;
                            case 'mp3':
                                mp3.push(file);
                                break;
                            case 'zip':
                                zips.push(file);
                                break;
                            case 'docx':
                                docs.push(file);
                                break;
                            case 'srt':
                                srts.push(file);
                                break;
                            case 'xlsx':
                                xlsx.push(file);
                                break;
                            case 'img':
                                img.push(file);
                                break;
                                /** Populate the error array with a message if 
                                 the uploaded file isnt supported by this module **/
                            default:
                                err.type = "UNSUPPORTED_FILE";
                                err.message = `${uploadedFiles[uploadedFileindex].type} file is not supported`;

                                /** If file exist in the temp folder, push it to the bin array**/
                                bin.push(file);
                                break;
                        }
                        /** Populate the others array with the uploaded file **/
                        if (file.type !== 'img') others.push(file);
                    } else {

                        /** Populate the error array with a message **/
                        err.type = "UNACCEPTABLE_FILE";
                        err.message = `${file.type} file is not acceptable`;

                        /** If file exist in the temp folder, push it to the bin array **/
                        if (file.path) bin.push(file);
                    }

                });

                /** If the bin is not empty **/
                if (bin.length != 0) {
                    /** Loop through it **/
                    bin.forEach(files => {
                        /** Read the files in it **/
                        fs.readFile(files.path).then(file => {
                            /** Check if its there **/
                            if (file) {
                                /** Then delete it **/
                                deleteFileFrom(files.path, () => console.log("file deleted"));
                            }
                        }).catch(e => console.log("file not deleted because", e.message));
                    });
                }
            }

        };
        /** call the file processing function **/
        init();

        getTypes = () => {

            /**
             * PS: This returns the uploaded file(s) type(s) in our fileType array
             * only if it matches our expected file 
             * else it returns an empty array **/
            return fileType;
        };

        /** 
         * PS: Remember our little algorithm doesn't allow 
         * multiple files with same type *
         **/
        const image = () => {
            /** Return the first data in our img array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = img[0].path,
                name = img[0].filename,
                file = img;
            return { path, name, file };
        };

        const docx = () => {
            /** Return the first data in our doc array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = doc[0].path,
                name = doc[0].filename,
                file = doc;
            return { path, name, file };
        };

        const video = () => {
            /** Return the first data in our mp4 array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = mp4[0].path,
                name = mp4[0].filename,
                file = mp4;
            return { path, name, file };

        };

        const audio = () => {
            /** Return the first data in our mp3 array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = mp3[0].path,
                name = mp3[0].filename,
                file = mp3;
            return { path, name, file };

        };

        const pdf = () => {
            /** Return the first data in our pdfs array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = pdfs[0].path,
                name = pdfs[0].filename,
                file = pdfs;
            return { path, name, file };
        };

        const zip = () => {
            /** Return the first data in our zips array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = zips[0].path,
                name = zips[0].filename,
                file = zips;
            return { path, name, file };
        };

        const srt = () => {
            /** Return the first data in our srts array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = srts[0].path,
                name = srts[0].filename,
                file = srts;
            return { path, name, file };
        };

        const excel = () => {
            /** Return the first data in our xlsx array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = xlsx[0].path,
                name = xlsx[0].filename,
                file = xlsx;
            return { path, name, file };
        };

        const other = () => {
            /** Return the first data in our others array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = others[0].path,
                name = others[0].filename,
                file = others;
            return { path, name, file };
        };

        const exist = () => {
            /** This data returns true if only the file we are expecting is what was uploaded **/
            let exists = getTypes().length > 0 ? true : false;
            return exists;
        };

        const error = () => {
            /** return the error message within the array **/
            return err;
        };

        return { getTypes, image, docx, zip, video, audio, other, exist, excel, srt, pdf, error };
    } catch (e) {
        console.log(e.message);
    }
};