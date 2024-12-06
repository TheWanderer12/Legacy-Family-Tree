import express, { Request, Response } from "express";
import FamilyTree from "../models/FamilyTree";
import { Node, Relation, RelType } from "../../types";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/** Get all family trees */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const trees = await FamilyTree.find();
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
    res.json({
      id: tree._id,
      name: tree.name,
      members: tree.members,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Create a new family tree
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newTree = new FamilyTree({ name, members: [] });
    const savedTree = await newTree.save();
    res.status(201).json({
      id: savedTree._id,
      name: savedTree.name,
      members: savedTree.members,
    });
  } catch (err) {
    console.error("Error creating new tree:", err);
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

/** Add a new member to a family tree */
router.post("/:treeId/members", async (req: Request, res: Response) => {
  try {
    const { treeId } = req.params;
    const newMemberData: Node = req.body;
    newMemberData.id = uuidv4(); // Generate a unique ID for the new member

    const tree = await FamilyTree.findById(treeId);
    if (!tree) {
      return res.status(404).json({ error: "Family tree not found" });
    }

    tree.members.push(newMemberData);
    await tree.save();

    res.status(201).json(newMemberData);
  } catch (err) {
    console.error("Error adding new member:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

/** Add a relationship between two members */
router.post(
  "/:treeId/members/:memberId/relation",
  async (req: Request, res: Response) => {
    try {
      const { treeId, memberId } = req.params;
      const {
        relatedMemberId,
        type,
        mode,
        childrenForSpouse,
        spouseIdForChild,
      } = req.body;

      if (!relatedMemberId || !type || !mode) {
        return res
          .status(400)
          .json({ error: "Related member ID, type, and mode are required" });
      }

      const tree = await FamilyTree.findById(treeId);
      if (!tree) {
        return res.status(404).json({ error: "Family tree not found" });
      }

      const member = tree.members.find((m) => m.id === memberId);
      const relatedMember = tree.members.find((m) => m.id === relatedMemberId);

      if (!member || !relatedMember) {
        console.error("Member(s) not found during relation addition:");
        console.error("memberId:", memberId, "member:", member);
        console.error(
          "relatedMemberId:",
          relatedMemberId,
          "relatedMember:",
          relatedMember
        );
        return res.status(404).json({ error: "Member(s) not found" });
      }

      if (mode === "parent") {
        // Adding a parent to the focused member
        // Focused member gets a parent
        member.parents.push({ id: relatedMemberId, type });
        // The related member (new parent) gets this member as a child
        relatedMember.children.push({ id: memberId, type });
      } else if (mode === "child") {
        // Adding a child to the focused member
        // Focused member gets a child
        member.children.push({ id: relatedMemberId, type });
        // The related member (new child) gets this member as a parent
        relatedMember.parents.push({ id: memberId, type });

        // If a spouse is selected as another parent
        if (spouseIdForChild && spouseIdForChild !== "none") {
          const spouse = tree.members.find((m) => m.id === spouseIdForChild);
          if (spouse) {
            // Add spouse as a blood parent of the new child
            relatedMember.parents.push({
              id: spouseIdForChild,
              type: RelType.blood,
            });
            // Add the child to spouse's children
            spouse.children.push({
              id: relatedMemberId,
              type: RelType.blood,
            });
          }
        }
      } else if (mode === "sibling") {
        // Adding a sibling to the focused member
        member.siblings.push({ id: relatedMemberId, type });
        relatedMember.siblings.push({ id: memberId, type });
      } else if (mode === "spouse") {
        // Adding a spouse to the focused member
        member.spouses.push({ id: relatedMemberId, type });
        relatedMember.spouses.push({ id: memberId, type });

        // Handle children for the new spouse
        if (Array.isArray(childrenForSpouse)) {
          // Children chosen as "blood" children of the spouse
          childrenForSpouse.forEach((childId: string) => {
            const child = tree.members.find((m) => m.id === childId);
            if (child) {
              // The spouse becomes a blood parent of these selected children
              child.parents.push({ id: relatedMemberId, type: RelType.blood });
              relatedMember.children.push({
                id: childId,
                type: RelType.blood,
              });
            }
          });

          // Children not selected become 'adopted' for the spouse
          const otherChildren = member.children
            .filter((rel) => !childrenForSpouse.includes(rel.id))
            .map((rel) => rel.id);

          otherChildren.forEach((childId) => {
            const child = tree.members.find((m) => m.id === childId);
            if (child) {
              child.parents.push({
                id: relatedMemberId,
                type: RelType.adopted,
              });
              relatedMember.children.push({
                id: childId,
                type: RelType.adopted,
              });
            }
          });
        }
      } else {
        return res.status(400).json({ error: "Invalid mode" });
      }

      await tree.save();
      res.json({ message: "Relation added successfully" });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

/** Update a family tree's name */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const tree = await FamilyTree.findById(req.params.id);
    if (!tree) {
      return res.status(404).json({ error: "Family tree not found" });
    }

    tree.name = req.body.name || tree.name;
    const updatedTree = await tree.save();
    res.json({
      id: updatedTree._id,
      name: updatedTree.name,
      members: updatedTree.members,
    });
  } catch (err) {
    console.error("Error updating tree name:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

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

      // Only update allowed fields
      member.name = updatedData.name || member.name;
      member.surname = updatedData.surname || member.surname;
      member.gender = updatedData.gender || member.gender;
      member.dateOfBirth = updatedData.dateOfBirth || member.dateOfBirth;
      member.description = updatedData.description || member.description;

      await tree.save();
      res.json(member);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

/** Other routes remain the same **/

export default router;
