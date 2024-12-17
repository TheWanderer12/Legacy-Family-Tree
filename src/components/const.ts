/**
 * this file was used for loading family trees from local JSON files, however, I changed it to load family trees from the mongoDB server, and therefore I am not using this file anymore. You can try to pass one of these files as 'nodes' variable to App.tsx to see how it renders it.
 */
import averageTree from "../data/average-tree.json";
import { members } from "../data/couple.json";
import diffParents from "../data/diff-parents.json";
import divorcedParents from "../data/divorced-parents.json";
import severalSpouses from "../data/several-spouses.json";
import simpleFamily from "../data/simple-family.json";
import sampleData from "../data/simple-family.json";
import testTreeN1 from "../data/test-tree-n1.json";
import testTreeN2 from "../data/test-tree-n2.json";
import type { Node } from "./Types/types";

export const NODE_WIDTH = 90;
export const NODE_HEIGHT = 100;

export const SOURCES = {
  // "couple.json": members,
  // "average-tree.json": averageTree,
  // "diff-parents.json": diffParents,
  // "divorced-parents.json": divorcedParents,
  // "empty.json": empty,
  // "sample-data.json": sampleData,
  // "several-spouses.json": severalSpouses,
  // "simple-family.json": simpleFamily,
  // "test-tree-n1.json": testTreeN1,
  // "test-tree-n2.json": testTreeN2,
} as Readonly<{ [key: string]: readonly Readonly<Node>[] }>;

export const DEFAULT_SOURCE = Object.keys(SOURCES)[0];

export const URL_LABEL = "URL (Gist, Paste.bin, ...)";
