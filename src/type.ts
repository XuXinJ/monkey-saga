/*
 * @Author: xuxinjiang
 * @Date: 2022-11-04 14:43:39
 * @LastEditors: your name
 * @LastEditTime: 2022-11-04 15:28:31
 * @Description: file content
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export interface ActionType {
  payload: any;
  type: string;
  getState: (key?: string) => any;
  [key: string]: any;
}

export interface Action2Type<ST> {
  dispatch: (data: { type: string; payload: any }) => void;
  state: ST;
  getState: (key?: string) => any;
}

export interface IModel<
  NT extends string,
  ST extends Record<string, any>,
  RT extends Record<string, (state: ST, ac: ActionType) => any>,
  AT extends Record<string, (ac: ActionType, ac2: Action2Type<ST>) => void>
> {
  namespace: NT;
  state: ST;
  reducers: RT;
  actions: AT;
}
