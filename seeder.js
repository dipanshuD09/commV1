import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./seederData/users.js";
import roles from "./seederData/roles.js";
import User from "./models/userModel.js";
import Role from "./models/roleModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Role.deleteMany();

        await User.insertMany(users);
        await Role.insertMany(roles);

        console.log("data imported".green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        console.log("data deleted!!".red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if(process.argv[2] === '-d'){
    deleteData();
} else{
    importData();
};