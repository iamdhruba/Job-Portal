import { User } from "../model/user.model.js";

export const registerUser = async (data) => {
    try {
        const user = new User(data);
        return await user.save();
    } catch (error) {
        console.error("Error creating user");
        throw error;
    }
};
