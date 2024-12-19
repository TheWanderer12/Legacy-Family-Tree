import express, { Request, Response } from "express";
import FamilyTree from "../models/FamilyTree";
import { Node, RelType } from "../../types";
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
        // Adding a parent
        member.parents.push({ id: relatedMemberId, type });
        relatedMember.children.push({ id: memberId, type });

        // Now handle siblings of 'member'
        for (const siblingRel of member.siblings) {
          const sibling = tree.members.find((m) => m.id === siblingRel.id);
          if (!sibling) continue;

          let parentChildType: RelType;

          if (siblingRel.type === RelType.blood) {
            // If sibling is blood:
            // parent-member = blood => parent-sibling = blood
            // parent-member = adopted => parent-sibling = adopted
            parentChildType =
              type === RelType.blood ? RelType.blood : RelType.adopted;
          } else if (siblingRel.type === RelType.half) {
            // If sibling is half:
            // parent-member = blood => parent-sibling = adopted
            // parent-member = adopted => parent-sibling = blood
            if (type === RelType.blood) {
              parentChildType = RelType.adopted;
            } else {
              // type === RelType.adopted
              parentChildType = RelType.blood;
            }
          } else {
            // If there's another relationship type not defined, fallback to adopted
            parentChildType = RelType.adopted;
          }

          // Add sibling as child to the new parent if not already there
          if (!relatedMember.children.some((c) => c.id === sibling.id)) {
            relatedMember.children.push({
              id: sibling.id,
              type: parentChildType,
            });
          }

          // Add new parent as parent to the sibling if not already there
          if (!sibling.parents.some((p) => p.id === relatedMemberId)) {
            sibling.parents.push({
              id: relatedMemberId,
              type: parentChildType,
            });
          }
        }
      } else if (mode === "child") {
        // Adding a child
        member.children.push({ id: relatedMemberId, type });
        relatedMember.parents.push({ id: memberId, type });

        if (spouseIdForChild && spouseIdForChild !== "none") {
          const spouse = tree.members.find((m) => m.id === spouseIdForChild);
          if (spouse) {
            relatedMember.parents.push({
              id: spouseIdForChild,
              type: RelType.blood,
            });
            spouse.children.push({
              id: relatedMemberId,
              type: RelType.blood,
            });
          }
        }
      } else if (mode === "sibling") {
        // Adding a sibling
        member.siblings.push({ id: relatedMemberId, type });
        relatedMember.siblings.push({ id: memberId, type });

        // Replicate parents:
        for (const parentRel of member.parents) {
          // Add this parent to the sibling's parents
          relatedMember.parents.push({
            id: parentRel.id,
            type: parentRel.type,
          });

          // Find the parent in the tree
          const parentNode = tree.members.find((m) => m.id === parentRel.id);
          if (parentNode) {
            // Add this new sibling as a child to the parent
            parentNode.children.push({
              id: relatedMemberId,
              type: parentRel.type,
            });
          }
        }
      } else if (mode === "spouse") {
        // Adding a spouse
        member.spouses.push({ id: relatedMemberId, type });
        relatedMember.spouses.push({ id: memberId, type });

        // Handle children for the spouse
        // If childrenForSpouse is provided and is an array, proceed with that logic
        if (Array.isArray(childrenForSpouse)) {
          // If childrenForSpouse is empty, it means no children are selected as blood.
          // If we want no adopted children added automatically when empty, we should check if it's length > 0.
          const selectedChildren = childrenForSpouse || [];

          // Add selected children as blood
          for (const childId of selectedChildren) {
            const child = tree.members.find((m) => m.id === childId);
            if (child) {
              child.parents.push({ id: relatedMemberId, type: RelType.blood });
              relatedMember.children.push({ id: childId, type: RelType.blood });
            }
          }

          // If we want to add other children as adopted ONLY if childrenForSpouse was provided:
          // Check if childrenForSpouse is defined and if we want to do the adopted logic only if it's non-empty.
          if (selectedChildren.length > 0) {
            const otherChildren = member.children
              .filter((rel) => !selectedChildren.includes(rel.id))
              .map((rel) => rel.id);

            for (const childId of otherChildren) {
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
            }
          }
        } else {
          // If childrenForSpouse is not provided at all, we do nothing extra here.
          // No adopted children logic will run if we skip this part entirely.
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

export default router;
