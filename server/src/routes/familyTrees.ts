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

/** Add a relationship between two members */
router.post(
  "/:treeId/members/:memberId/relation",
  async (req: Request, res: Response) => {
    try {
      const { treeId, memberId } = req.params;
      const { relatedMemberId, type } = req.body;

      if (!relatedMemberId || !type) {
        return res
          .status(400)
          .json({ error: "Related member ID and type are required" });
      }

      const tree = await FamilyTree.findById(treeId);
      if (!tree) {
        return res.status(404).json({ error: "Family tree not found" });
      }

      const member = tree.members.find((m) => m.id === memberId);
      const relatedMember = tree.members.find((m) => m.id === relatedMemberId);

      if (!member || !relatedMember) {
        return res.status(404).json({ error: "Member(s) not found" });
      }

      // Add relationship based on type
      switch (type) {
        case "blood":
        case "adopted":
          member.children.push({ id: relatedMemberId, type });
          relatedMember.parents.push({ id: memberId, type });
          break;

        case "married":
        case "divorced":
          member.spouses.push({ id: relatedMemberId, type });
          relatedMember.spouses.push({ id: memberId, type });
          break;

        case "half":
        case "blood": // For siblings
          member.siblings.push({ id: relatedMemberId, type });
          relatedMember.siblings.push({ id: memberId, type });
          break;

        default:
          return res.status(400).json({ error: "Invalid relationship type" });
      }

      await tree.save();
      res.json({ message: "Relation added successfully" });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

/** Update an existing member */
router.put(
  "/:treeId/members/:memberId",
  async (req: Request, res: Response) => {
    try {
      const { treeId, memberId } = req.params;
      const updatedData = req.body;

      const tree = await FamilyTree.findById(treeId);
      if (!tree) {
        return res.status(404).json({ error: "Family tree not found" });
      }

      const member = tree.members.find((m) => m.id === memberId);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }

      // Merge updated data into the member
      Object.assign(member, updatedData);

      await tree.save();
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

/** Delete a member from a family tree */
router.delete(
  "/:treeId/members/:memberId",
  async (req: Request, res: Response) => {
    try {
      const { treeId, memberId } = req.params;

      const tree = await FamilyTree.findById(treeId);
      if (!tree) {
        return res.status(404).json({ error: "Family tree not found" });
      }

      // Remove the member
      const memberIndex = tree.members.findIndex((m) => m.id === memberId);
      if (memberIndex === -1) {
        return res.status(404).json({ error: "Member not found" });
      }

      // Remove references to this member in other relationships
      tree.members.forEach((m) => {
        m.parents = m.parents.filter((rel) => rel.id !== memberId);
        m.children = m.children.filter((rel) => rel.id !== memberId);
        m.siblings = m.siblings.filter((rel) => rel.id !== memberId);
        m.spouses = m.spouses.filter((rel) => rel.id !== memberId);
      });

      tree.members.splice(memberIndex, 1);
      await tree.save();

      res.json({ message: "Member deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);
export default router;
