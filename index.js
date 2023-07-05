const express = require("express");
const app = express();
const mongoose = require('mongoose');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require("fs");
const ProductModel = require("./models/ImageModel");

app.get("/", (request, response) => {
    response.send("testing");
});

app.post("/uploads", upload.array('images'), async (request, response) => {


    request.files.forEach((image, index) => {
        uploadImage(request, image, index);
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


function uploadImage(request, image, ind) {
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

mongoose.connect('mongodb://127.0.0.1:27017/nodeProject').then(() => {
    app.listen(3003, () => console.log("server and db running"))
})
