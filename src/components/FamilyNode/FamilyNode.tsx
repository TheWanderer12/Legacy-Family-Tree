import React, { useCallback } from "react";
import classNames from "classnames";
import type { ExtNode } from "../Types/types";
import css from "./FamilyNode.module.css";

interface FamilyNodeProps {
  node: ExtNode;
  isRoot: boolean;
  isHover?: boolean;
  isSelected?: boolean;
  onClick: (id: string) => void;
  onSubClick: (id: string) => void;
  style?: React.CSSProperties;
}

export function FamilyNode({
  node,
  isRoot,
  isHover,
  isSelected,
  onClick,
  onSubClick,
  style,
}: FamilyNodeProps) {
  const clickHandler = useCallback(() => onClick(node.id), [node.id, onClick]);
  const clickSubHandler = useCallback(
    () => onSubClick(node.id),
    [node.id, onSubClick]
  );

  return (
    <div className={css.root} style={style}>
      <div
        className={classNames(
          css.inner,
          css[node.gender],
          isRoot && css.isRoot,
          isHover && css.isHover,
          isSelected && css.isSelected
        )}
        onClick={clickHandler}
      >
        <div className={css.name}> {node.name}</div>
        <div className={css.surname}> {node.surname}</div>
        {/* <div className={css.img}> <img src={"../data/img/"}{node.id}{".jpg"} alt="" /></div> */}
      </div>
      {node.hasSubTree && (
        <div
          className={classNames(css.sub, css[node.gender])}
          onClick={clickSubHandler}
        />
      )}
    </div>
  );
}
