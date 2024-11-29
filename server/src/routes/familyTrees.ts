import express, { Request, Response } from "express";
import FamilyTree from "../models/FamilyTree";

const router = express.Router();

/** Get all family trees */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const trees = await FamilyTree.find();
    console.log("Retrieved trees:", trees);
    const formattedTrees = trees.map((tree) => ({
      id: tree._id,
      name: tree.name,
      members: tree.members,
    }));
    res.json(formattedTrees);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/** Get a single family tree */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const tree = await FamilyTree.findById(req.params.id);
    if (!tree) {
      return res.status(404).json({ error: "Family tree not found" });
    }
    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/** Add a new family tree */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body;

    if (!name || !members) {
      return res.status(400).json({ error: "Name and members are required" });
    }

    const newTree = new FamilyTree({ name, members });
    const savedTree = await newTree.save();
    res.status(201).json(savedTree);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/** Delete a family tree */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const tree = await FamilyTree.findByIdAndDelete(req.params.id);
    if (!tree) {
      return res.status(404).json({ error: "Tree not found" });
    }
    res.json({ message: "Tree deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
