import React from "react";
import { Range } from "slate";
import { RoleModal } from "../../role-modal";
import { Tag } from "../tag";
import { OverlappingTag, TagRange } from "../types";

import css from "./interview-item.module.scss";

export type IRole = {
  id: string;
  label: string;
};

export type IInterviewItemProps = {
  role: IRole;
  tags: OverlappingTag[];
  text: string;
  roleRef: React.RefObject<HTMLDivElement>;
  children: string;
  onRoleClick: () => void;
};

const generateHtml = (text: string, tags: OverlappingTag[]): JSX.Element => {
  const first = tags[0];
  const last = tags[tags.length - 1];
  const result = tags.reduce((acc, curr) => {
    const from = curr.range.from;
    const to = curr.range.to;

    const tagText = text.slice(from, to + 1);

    // const before = text.slice(0, from);
    // const between = text.slice(from, to);
    // const after = text.slice(to, text.length - 1);

    // const result =
    //   before + `<span class="${curr.tagId}">` + between + `</span>` + after;

    const res = <Tag tagId={curr.tagId}>{tagText}</Tag>;

    return [...acc, res];
  }, [] as JSX.Element[]);

  const start = <>{first ? text.slice(0, first?.range.from) : ""}</>;
  const end = <>{last ? text.slice(last?.range.to + 1) : ""}</>;

  const full = result.length ? <>{[start, ...result, end]}</> : <>{text}</>;

  console.log(result);

  return full;
};

const substractRange = (include: TagRange, exclude: TagRange): TagRange[] => {
  if (include.from < exclude.from) {
    if (include.to > exclude.from) {
      if (include.to > exclude.to) {
        return [
          { from: include.from, to: exclude.from },
          { from: exclude.to, to: include.to },
        ];
      } else {
        return [{ from: include.from, to: exclude.from }];
      }
    } else {
      return [{ from: include.from, to: include.to }];
    }
  } else {
    if (exclude.to > include.from) {
      if (exclude.to >= include.to) {
        return [{ from: -1, to: -1 }];
        // return new Range();
      } else {
        return [{ from: exclude.to, to: include.to }];
      }
    } else {
      return [{ from: include.from, to: include.to }];
    }
  }
};

const numberListToRanges = (numbers: number[]): TagRange[] => {
  let ranges: TagRange[] = [];
  let start = numbers[0];

  numbers.forEach((number, idx, arr) => {
    if (idx < arr.length && number + 1 !== arr[idx + 1]) {
      ranges.push({ from: start, to: number });
      start = arr[idx + 1];
    }
  });

  return ranges;
};

const substractRangesFromRange = (
  range: TagRange,
  exclude: TagRange[]
): TagRange[] => {
  const start = range.from;
  const end = range.to;

  const length = end - start + 1;

  const numbers = [...new Array(length)].map((_, idx) => start + idx);

  const result = exclude.reduce((acc, curr) => {
    return acc.filter((num) => num < curr.from || num > curr.to);
  }, numbers as number[]);

  const ranges = numberListToRanges(result);

  return ranges;
};

export type BlockRanges = { [key: string]: TagRange[] };

const flattenAndSortTagRanges = (
  blockRanges: BlockRanges
): OverlappingTag[] => {
  const entries = Object.entries(blockRanges).reduce((acc, [key, entry]) => {
    const tags = entry.flatMap<OverlappingTag>((range) => ({
      tagId: key,
      range,
    }));
    return [...acc, ...tags];
  }, [] as OverlappingTag[]);

  const sortedEntries = entries.sort((a, b) => a.range.from - b.range.from);

  return sortedEntries;
};

export const InterviewItem = React.memo(function InterviewItem({
  role,
  tags,
  text,
  roleRef,
  onRoleClick,
  children,
}: IInterviewItemProps) {
  const result = tags.reduce((acc, curr, idx, arr) => {
    const from = curr.range.from;
    const to = curr.range.to;

    const hasOverlaps = arr.some(
      (tag, tagIdx) =>
        tagIdx !== idx && tag.range.from >= from && tag.range.from <= to
    );

    const overlappedTags = arr.reduce((acc, curr, index, arr) => {
      const hasOverlap =
        index > idx && curr.range.from >= from && curr.range.from <= to;
      return hasOverlap ? [...acc, curr] : acc;
    }, [] as OverlappingTag[]);

    const overlappedTagsRanges = overlappedTags.map((tag) => tag.range);

    // console.log(overlappedTagsRanges);

    const ranges = substractRangesFromRange({ from, to }, overlappedTagsRanges);

    console.log(
      `Range #${idx}: ${from} -> ${to} was splitted into ${ranges
        .map((range) => `${range.from} -> ${range.to}`)
        .join(", ")})`
    );

    return { ...acc, [curr.tagId]: [...ranges] };

    // const before = text.slice(0, from);
    // const between = text.slice(from, to);
    // const after = text.slice(to, text.length - 1);

    // const result =
    //   before + `<span class="${curr.tagId}">` + between + `</span>` + after;

    // return [...acc, result];
  }, {} as BlockRanges);

  const tagList = flattenAndSortTagRanges(result);

  const spans = generateHtml(text, tagList);

  return (
    <div className={css.interviewItem}>
      <div
        className={css.profilePicture}
        contentEditable={false}
        onClick={onRoleClick}
      ></div>
      <div className={css.main}>
        <div
          className={css.role}
          ref={roleRef}
          contentEditable={false}
          onClick={onRoleClick}
        >
          {role.label}
        </div>
        <div className={css.content}>{spans}</div>
      </div>
    </div>
  );
});
