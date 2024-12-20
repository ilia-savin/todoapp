const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();
const CONNECTION_STRING = "mongodb+srv://admin:admin@cluster0.yxa6i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DATABASE_NAME = "todoappdb";
let database;

async function connectToDatabase() {
    try {
        const client = new MongoClient(CONNECTION_STRING);
        await client.connect();
        database = client.db(DATABASE_NAME);
        console.log("MongoDB Connection Successful");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

const PORT = 5038;
app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`The server is running on http://localhost:${PORT}`);
});

app.get('/api/todoapp/GetNotes', async (req, res) => {
    try {
        const notes = await database.collection("todoappcollection").find({}).toArray();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error Fetching Notes", error });
    }
});


app.post('/api/todoapp/AddNotes', upload.none(), async (req, res) => {
    try {
        const { newNotes } = req.body;
        if (!newNotes) {
            return res.status(400).json({ message: "The Note Field Is Required" });
        }

        const noteCount = await database.collection("todoappcollection").countDocuments();
        await database.collection("todoappcollection").insertOne({
            id: (noteCount + 1).toString(),
            description: newNotes
        });
        res.status(201).json({ message: "Note Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Adding Note", error });
    }
});

app.delete('/api/todoapp/DeleteNotes', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "ID Field Required" });
        }

        const result = await database.collection("todoappcollection").deleteOne({ id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Note Is Not Found" });
        }

        res.status(200).json({ message: "Note Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Deleting Note", error });
    }
});