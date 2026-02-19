import mongoose from 'mongoose';


const conectToDatabase = async () => {
    try {
        // eslint-disable-next-line no-undef
        await mongoose.connect(`mongodb+srv://admin:${process.env.PASSWORD_MONGODB}@cluster0.7mbb3ko.mongodb.net/?appName=Cluster0`);
        console.log("Connected to your query mongodb")
    }
    catch (error) {
        console.log(`Error: ${error}`)
    }
}


export default conectToDatabase