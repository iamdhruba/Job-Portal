const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./database/index");
connectDB();

app.get("/", (req, res) => {
    // const person = {
    //     name: "John Doe",
    //     age: 30,
    //     city: "New York",
    // };
    // res.send(person);
    res.status(200).json({
        message: "Success",
    });
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
