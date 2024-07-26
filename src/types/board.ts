// ----------------------------------------------------------------------

export type BoardFilters = {
  boardMasterId: number | undefined;
};

export type Comment = {
  id?: number;
  boardId: number;
  commentNo: number;
  content: string;
  useYn: boolean;
  authorName: string;
  modifiedTime: string;
};

export type Board = {
  id?: number;
  boardMasterId: number;
  title: string;
  content: string;
  boardNo?: number;
  parentId?: number;
  viewCount?: number;
  useYn?: boolean;
  pinYn?: boolean;
  popupYn?: boolean;
  pinStartTime?: string;
  pinEndTime?: string;
  popupStartTime?: string;
  popupEndTime?: string;
  files: any[];
};

export const defaultBoardFilters = (e: number) => ({
  boardMasterId: e,
});
