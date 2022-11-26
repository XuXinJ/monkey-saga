<!--
 * @Author: xuxinjiang
 * @Date: 2022-11-01 11:40:20
 * @LastEditors: your name
 * @LastEditTime: 2022-11-26 17:39:12
 * @Description: file content
-->

# 轻量级redux状态管理工具

monkey-saga 工具是对 redux 写法统一规范管理，简化使用方式，提供 ts 类型推断等功能，提高开发者开发效率和便于长期维护。

## 1. 安装

```sh
yarn add monkey-saga
```

or

```sh
npm install monkey-saga
```

## 如何使用

### 创建 model

创建 model model/home.ts 文件

```Typescript

import { createModel } from 'monkey-saga';

const homeModel = createModel('homeModel',{
  state: {
    test: '44',
    txt:'11'
  },
	//reducers对象的属性函数会返回的对象就是修改state里面的属性值
  reducers: {
    addText(state, { payload, getState }) {
      return {
        test: action.payload,
      };
    },
		fixText(state, action) {
      return {
        ...state,
        txt: action.payload,
      };
    },
  },
  actions: {
    async apiFun(action, { dispatch, state , getState }) {
      const getApi = (val) =>{
			  return new Promise((resolve) => {
			    setTimeout(() => {
			      resolve(val);
			    }, 2000);
			  });
			}
			const res = await getApi(action.payload)
      dispatch({ type: 'homeModel/addText', payload: res });
    },
		async fixData(action, { dispatch,state,getState }) {
      dispatch({ type: 'homeModel/addText', payload: '1111' });
      dispatch({ type: 'xxx/xxxx', payload: {name:'可以调用其他模型reducers或actions' }});
    },
  },
}
export default homeModel

```

### 创建一个 index.ts

创建一个 index.ts model/index.ts 文件

```Typescript
import monkeySage from 'monkey-saga';
import homeModel from './home';
import xxxModel from './xxx'; // 可以创建其他模型

// monkeySage 函数传入模型对象数组 返回 store 对象 和 ActionType 枚举值
export const { store, ActionType } = monkeySage([homeModel,xxxModel]);
```

### 注入 store 对象

在入口组件注入 store 对象

```Typescript
import { store } from '@/model/index';
import { Provider } from 'react-redux';
export default (props: any) => {
  return (
    <Provider store={store}>
      <div>测试</div>
      {props.children}
    </Provider>
  );
};
```

### 组件内使用

```Typescript

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionType } from '@/model/index';
const Home = () => {
  const dispatch = useDispatch();
  const { homeModel } = useSelector((state) => state);
  useEffect(() => {
    dispatch({
      type: ActionType.homeModel.addText, // 也可以直接写成 type:"homeModel/addText"
      payload: 'addTextValue',
    });
  }, []);

	const getApiData = ()=>{
		dispatch({
      type: ActionType.homeModel.apiFun, // 也可以直接写成 type:"homeModel/apiFun"
      payload: 'addTextValue',
    });
	}
  return <div onClick={getApiData}>{homeModel.test}</div>;
};
export default Home;

```

## API

### createModel 函数

创建模型函数，返回一个模型对象。

```Typescript
import { createModel } from 'monkey-saga';

const model = createModel(namespace,modelData)

```

| 参数      | 说明     | 类型   | 是否必填 |
| --------- | -------- | ------ | -------- |
| namespace | 命令空间 | String | 是       |

#### ModelData 类型参数

| 参数     | 说明                                | 类型                             | 是否必填 |
| -------- | ----------------------------------- | -------------------------------- | -------- |
| state    | 初始化状态数据                      | Record&lt;string, any&gt;        | 是       |
| reducers | 修改 state 函数                     | Record&lt;string, ReducerFun&gt; | 是       |
| actions  | actions 函数，可以处理一些 api 数据 | Record&lt;string, ActionFun&gt;  | 是       |

#### ReducerFun 类型

返回值就是修改 state 的数据

```Typescript
type ActionData = {
	payload:any,
	getState: (namespace?: string) => any;  // 获取state数据
	[x:string]:any
}
(state: Record<string, any>, action: ActionData) => any

```

#### ActionFun 类型

```Typescript
type ActionData = {
	dispatch: (data: { type: string; payload: any }) => void;
  state: Record<string, any>;
  getState: (namespace?: string) => any;
}

(data:{ type:string,[x:string]:any}, action: ActionData) => void

```

#### getState 函数

获取状态管理数据

| 参数      | 说明         | 类型   | 是否必填                         |
| --------- | ------------ | ------ | -------------------------------- |
| namespace | 命令空间名字 | string | 否 (不传参数返回总的 state 数据) |

### monkeySaga

注册模型返回 store 对象

```Typescript
import monkeySaga , { createModel } from 'monkey-saga';

const model = createModel(namespace,modelData
const model2 = createModel(namespace,modelData)
const model3 = createModel(namespace,modelData)

export const { store, ActionType } = monkeySaga([model,model2,model3]);
```

#### store 对象

仓库对象必须在入口组件注入

```tsx
import { store } from "@/model/index";
import { Provider } from "react-redux";
export default (props: any) => {
  return <Provider store={store}>{props.children}</Provider>;
};
```

#### ActionType 对象

ActionType 集成所有 type 对象，具有 ts 推断能力，方便开发者快速填入 type

```tsx
dispatch({
  type: ActionType.homeModel.apiFun, // 也可以直接写成 type:"homeModel/apiFun"
  payload: "addTextValue",
});
```
