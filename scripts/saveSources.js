import connectDB from "../config/db";
import Source from "../models/Source";
import averageTree from "../src/data/average-tree.json";
import couple from "../src/data/couple.json";
import diffParents from "../src/data/diff-parents.json";
import divorcedParents from "../src/data/divorced-parents.json";
import empty from "../src/data/empty.json";
import severalSpouses from "../src/data/several-spouses.json";
import simpleFamily from "../src/data/simple-family.json";
import sampleData from "../src/data/sample-data.json";
import testTreeN1 from "../src/data/test-tree-n1.json";
import testTreeN2 from "../src/data/test-tree-n2.json";

const SOURCES = {
  "average-tree.json": averageTree,
  "couple.json": couple,
  "diff-parents.json": diffParents,
  "divorced-parents.json": divorcedParents,
  "empty.json": empty,
  "sample-data.json": sampleData,
  "several-spouses.json": severalSpouses,
  "simple-family.json": simpleFamily,
  "test-tree-n1.json": testTreeN1,
  "test-tree-n2.json": testTreeN2,
};

const saveSources = async () => {
  await connectDB();
  for (const [name, data] of Object.entries(SOURCES)) {
    const source = new Source({ name, data });
    await source.save();
  }
  console.log("Data saved to MongoDB");
  process.exit();
};

saveSources();
