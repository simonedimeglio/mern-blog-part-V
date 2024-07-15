import mongoose from "mongoose";

// NEW: AGGIUNGO LO SCHEMA PER I COMMENTI!
const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    _id: true, // Mi assicuro che ogni commento abbia un proprio _id univoco
  },
);

const blogPostSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: { type: String, required: true },
    content: { type: String, required: true },
    comments: [commentSchema], // NEW: Aggiungo l'array di commenti EMBEDDED.
  },
  {
    timestamps: true,
    collection: "blogPosts",
  },
);

export default mongoose.model("BlogPost", blogPostSchema);
