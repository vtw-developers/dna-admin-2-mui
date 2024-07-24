// ----------------------------------------------------------------------

export type BoardFilters = {
  boardMasterId: number | undefined;
};

export type Board = {
  id?: number;
  boardMasterId: number;
  title: string;
  content: string;
  boardNo?: number;
  parentId?: number;
  viewCount?: number;
  useYn: boolean;
  pinYn?: boolean;
  popupYn?: boolean;
  pinStartTime?: string;
  pinEndTime?: string;
  popupStartTime?: string;
  popupEndTime?: string;
  modifiedTime?: string;
};

export const defaultBoardFilters = (e: number) => ({
  boardMasterId: e,
});
