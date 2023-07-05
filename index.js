const express = require("express");
const app = express();
const mongoose = require('mongoose');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require("fs");
const ProductModel = require("./models/ProductModel");
const UserModel = require("./models/UserModel");
const bcrypt = require('bcrypt');

app.post("/uploads", upload.array('images'), async (request, response) => {


    request.files.forEach((image, index) => {
        uploadImages(request, image, index);
    });

    try {
        await ProductModel.create(request.body);
        response.json({
            status: true
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return response.json({
                status: false,
                errors: errors
            })
        }
    }

});


// create user
app.post("/signup", upload.single('image'), async (request, response) => {


    // upload file
    uploadImageSingle(request, request.file);
    request.files.forEach((image, index) => {
        uploadImages(request, image, index);
    });

    try {
        // check already registerd or not
        const userExist = await UserModel.find({ email: request.body.email });
        if (userExist.length > 0) {
            response.json({
                status: false,
                message: "This email is already registered"
            })
        }
        // generate hashed password
        request.body.password = await bcrypt.hash(request.body.password, 10);

        await UserModel.create(request.body);
        response.json({
            status: true
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return response.json({
                status: false,
                errors: errors
            })
        }
    }

});


// multiple
function uploadImages(request, image, ind) {
    if (image.mimetype == "image/png" || image.mimetype == "image/jpg" || image.mimetype == "image/jpeg") {
        let ext = image.mimetype.split("/")[1];
        const NewImgName = image.path + "." + ext;
        request.body['image' + ind] = NewImgName;
        fs.rename(image.path, NewImgName, () => { console.log("uploaded") });
    } else {
        fs.unlink(image.path, () => { console.log("deleted") })
        return response.json({
            status: "not allowed"
        })
    }
}

// single image
function uploadImageSingle(request, image) {
    if (image.mimetype == "image/png" || image.mimetype == "image/jpg" || image.mimetype == "image/jpeg") {
        let ext = image.mimetype.split("/")[1];
        const NewImgName = image.path + "." + ext;
        request.body.image = NewImgName;
        fs.rename(image.path, NewImgName, () => { console.log("uploaded") });
    } else {
        fs.unlink(image.path, () => { console.log("deleted") })
        return response.json({
            status: "not allowed"
        })
    }
}

mongoose.connect('mongodb://127.0.0.1:27017/nodeProject').then(() => {
    app.listen(3003, () => console.log("server and db running"))
})
