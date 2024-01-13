import mongoose from "mongoose";
const url = "mongodb+srv://sinhaniranjankumar21534:sinhaniranjankumar21534@cluster0.jza7rkj.mongodb.net/?retryWrites=true&w=majority";
export const connectDB = () => {
    mongoose
        .connect(url, { dbName: "Ecommerce_typescript" })
        .then((c) => console.log(`DB connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
