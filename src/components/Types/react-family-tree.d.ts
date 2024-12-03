declare module "react-family-tree" {
  import { Node, ExtNode } from "./types"; // Use your custom types

  interface Props {
    nodes: ReadonlyArray<Node>;
    rootId: string;
    width: number;
    height: number;
    placeholders?: boolean;
    className?: string;
    renderNode: (node: ExtNode) => React.ReactNode;
  }

  const ReactFamilyTree: React.NamedExoticComponent<Props>;
  export default ReactFamilyTree;
}
