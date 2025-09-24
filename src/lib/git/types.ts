export interface GitContext {
  targetTable?: string;
  targetRecord?: any;
  isModifying?: boolean;
}

export interface StagedChanges {
  [key: string]: any;
}

export interface GitState {
  context: GitContext;
  stagedChanges: StagedChanges;
}

export interface TableGitOperations {
  add: (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ) => Promise<string>;
  status: (state: GitState, data?: any) => string;
  commit: (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ) => Promise<string>;
  reset: (state: GitState, setState: (state: GitState) => void) => string;
  diff: (state: GitState, data?: any) => string;
  show: (data?: any) => string;
  target: (
    recordId: string,
    state: GitState,
    setState: (state: GitState) => void,
    data?: any,
  ) => string;
  rm: (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ) => Promise<string>;
  image: (
    args: string[],
    state: GitState,
    setState: (state: GitState) => void,
    mutations: any,
    data?: any,
  ) => Promise<string>;
}

export interface TableConfig {
  name: string;
  displayName: string;
  fields: string[];
  queryFunction: any;
  createFunction?: any;
  updateFunction?: any;
  deleteFunction?: any;
  requiresUserId?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  identifierField?: string;
}
