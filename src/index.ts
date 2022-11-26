import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import { Action2Type, ActionType, IModel, UnionToIntersection } from "./type";

export const createModel = <
  NT extends string,
  ST extends Record<string, any>,
  RT extends Record<string, (state: ST, ac: ActionType) => void>,
  AT extends Record<string, (ac: ActionType, ac2: Action2Type<ST>) => void>
>(
  namespace: NT,
  model: Omit<IModel<NT, ST, RT, AT>, "namespace">
) => ({
  namespace,
  ...model,
});
const monkeySage = <T extends IModel<any, any, any, any>>(
  models: T[]
): {
  store: unknown;
  ActionType: UnionToIntersection<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    T extends IModel<infer NT, infer _, infer AT, infer RT>
      ? { [k in NT]: AT & RT }
      : never
  >;
} => {
  const stateObj = {} as any;
  const modelsMap = new Map();
  const ActionType = {} as any;
  for (const md of models) {
    stateObj[md.namespace] = md.state;
    if (md.actions) {
      ActionType[md.namespace] = {};
      Object.keys(md.actions).forEach((key) => {
        ActionType[md.namespace][key] = `${md.namespace}/${key}`;
      });
      Object.keys(md.reducers).forEach((key) => {
        ActionType[md.namespace][key] = `${md.namespace}/${key}`;
      });
    }
    modelsMap.set(`${md.namespace}`, md);
  }

  const reducer = (state = stateObj, action: any) => {
    const name = action.type.split("/")[0];
    const key = action.type.split("/")[1];
    const md = modelsMap.get(name);
    if (md && md.reducers[key]) {
      const newMdState = md.reducers[key](state[name], {
        ...action,
        getState: (k: string) => {
          if (k) {
            return state[k];
          } else {
            return state;
          }
        },
      });
      if (newMdState) {
        return {
          ...state,
          [name]: { ...state[name], ...newMdState },
        };
      } else {
        return state;
      }
    } else if (md?.actions[key]) {
      md.actions[key](action, {
        dispatch: dispatchFun,
        state: state[name],
        getState: (k: string) => {
          if (k) {
            return state[k];
          } else {
            return state;
          }
        },
      });
      return state;
    } else {
      return state;
    }
  };
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducer, applyMiddleware(sagaMiddleware));
  const dispatchFun = (data: any) => {
    setTimeout(() => {
      store.dispatch(data);
    });
  };
  return { store, ActionType };
};
export default monkeySage;
