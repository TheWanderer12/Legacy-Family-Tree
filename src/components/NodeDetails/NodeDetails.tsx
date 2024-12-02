import React, { memo, useCallback } from "react";
import classNames from "classnames";
import type { Node } from "types/types";
import { Relations } from "./Relations";
import css from "./NodeDetails.module.css";

interface NodeDetailsProps {
  node: Readonly<Node>;
  className?: string;
  onSelect: (nodeId: string | undefined) => void;
  onHover: (nodeId: string) => void;
  onClear: () => void;
}

export const NodeDetails = memo(function NodeDetails({
  node,
  className,
  ...props
}: NodeDetailsProps) {
  const closeHandler = useCallback(() => props.onSelect(undefined), [props]);

  return (
    <section className={classNames(css.root, className)}>
      <header className={css.header}>
        <h3 className={css.title}>ID: {node.id}</h3>
        <h3 className={css.title}>name: {node.name}</h3>
        <h3 className={css.title}>surname: {node.surname}</h3>
        <h3 className={css.title}>dateOfBirth: {node.dateOfBirth}</h3>
        <h3 className={css.title}>description: {node.description}</h3>
        <button className={css.close} onClick={closeHandler}>
          close &#10005;
        </button>
      </header>
      <Relations {...props} title="Parents" items={node.parents} />
      <Relations {...props} title="Children" items={node.children} />
      <Relations {...props} title="Siblings" items={node.siblings} />
      <Relations {...props} title="Spouses" items={node.spouses} />
    </section>
  );
});
