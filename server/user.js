import mongoose from "mongoose";


const userSchema = new mongoose.Schema({ // Cria um "modelo" do meu usuário para cadastrar no banco
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    timeXP: {
        type: Number,
        required: true,
    },
    timeFull: {
        type: Number,
        required: true,
    },
    xp: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);