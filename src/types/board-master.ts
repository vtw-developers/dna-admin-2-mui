// ----------------------------------------------------------------------

export type BoardMasterFilters = {
  name: string;
};

export type BoardMaster = {
  id?: number;
  name: string;
  instruction: string;
  fileAttachYn: boolean;
  replyYn: boolean;
  commentYn: boolean;
  pinYn: boolean;
  popupYn: boolean;
  useYn: boolean;
  authorName?: string;
  modifiedTime?: string;
};

export const defaultBoardMasterFilters: BoardMasterFilters = {
  name: '',
};
