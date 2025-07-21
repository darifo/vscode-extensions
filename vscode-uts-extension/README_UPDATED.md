# UTS语言支持插件 - 完整TypeScript语法支持

## 概述

UTS语言支持插件现已升级，支持完整的TypeScript语法特性，为UTS开发提供强大的代码编辑体验。

## 主要特性

### 1. 完整的TypeScript语法支持

#### 基础类型系统
- ✅ 所有原始类型：`string`, `number`, `boolean`, `symbol`, `bigint`
- ✅ 复杂类型：`object`, `array`, `any`, `void`, `never`, `unknown`
- ✅ UTS特有类型：`UTSJSONObject`, `UTSJSONValue`, `UTSArray`, `UTSString`, `UTSNumber`, `UTSBoolean`

#### 高级类型特性
- ✅ 泛型支持：`Array<T>`, `Promise<T>`, `Map<K, V>`, `Set<T>`
- ✅ 联合类型：`string | number`
- ✅ 交叉类型：`TypeA & TypeB`
- ✅ 条件类型：`T extends U ? X : Y`
- ✅ 映射类型：`{ [K in keyof T]: T[K] }`
- ✅ 模板字面量类型：`` `Hello ${string}` ``
- ✅ 索引访问类型：`T[K]`
- ✅ 工具类型：`Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Record<K, T>`

#### 类型操作
- ✅ `keyof` 操作符
- ✅ `typeof` 操作符
- ✅ `infer` 关键字
- ✅ 类型谓词：`value is Type`
- ✅ 断言函数：`asserts value is Type`

### 2. 面向对象编程支持

#### 类定义
- ✅ 类声明和继承
- ✅ 访问修饰符：`public`, `private`, `protected`
- ✅ 静态成员和方法
- ✅ 抽象类和抽象方法
- ✅ 构造函数重载
- ✅ 方法重载

#### 接口
- ✅ 接口声明和继承
- ✅ 可选属性和只读属性
- ✅ 索引签名
- ✅ 调用签名和构造签名
- ✅ 泛型接口

#### 装饰器
- ✅ 类装饰器
- ✅ 方法装饰器
- ✅ 属性装饰器
- ✅ 参数装饰器

### 3. 函数和函数式编程

#### 函数类型
- ✅ 函数声明和表达式
- ✅ 箭头函数
- ✅ 函数重载
- ✅ 泛型函数
- ✅ 异步函数和Promise

#### 高级函数特性
- ✅ 可选参数和默认参数
- ✅ 剩余参数
- ✅ 解构参数
- ✅ 函数类型：`(x: number, y: number) => number`

### 4. 模块系统

#### 模块声明
- ✅ `import` 和 `export` 语句
- ✅ 默认导出和命名导出
- ✅ 重导出
- ✅ 动态导入
- ✅ 模块声明：`declare module`

#### 命名空间
- ✅ 命名空间声明
- ✅ 命名空间合并
- ✅ 嵌套命名空间

### 5. 枚举和常量

#### 枚举
- ✅ 数字枚举
- ✅ 字符串枚举
- ✅ 异构枚举
- ✅ 常量枚举

### 6. 高级语法特性

#### 解构和展开
- ✅ 对象解构
- ✅ 数组解构
- ✅ 展开运算符：`...`
- ✅ 剩余参数

#### 现代JavaScript特性
- ✅ 可选链操作符：`?.`
- ✅ 空值合并操作符：`??`
- ✅ 逻辑赋值操作符：`&&=`, `||=`, `??=`

#### 模板字符串
- ✅ 模板字面量
- ✅ 标签模板
- ✅ 模板字符串类型

### 7. 类型系统高级特性

#### 条件类型
- ✅ 基础条件类型：`T extends U ? X : Y`
- ✅ 分布式条件类型
- ✅ `infer` 关键字
- ✅ 条件类型中的约束

#### 映射类型
- ✅ 基础映射类型
- ✅ 条件映射类型
- ✅ 重映射：`as`
- ✅ 修饰符：`readonly`, `?`, `-readonly`, `-?`

#### 模板字面量类型
- ✅ 基础模板字面量类型
- ✅ 条件模板字面量类型
- ✅ 递归模板字面量类型

### 8. 工具类型

#### 内置工具类型
- ✅ `Partial<T>` - 将所有属性变为可选
- ✅ `Required<T>` - 将所有属性变为必需
- ✅ `Readonly<T>` - 将所有属性变为只读
- ✅ `Pick<T, K>` - 选择指定属性
- ✅ `Record<K, T>` - 创建键值对类型
- ✅ `Exclude<T, U>` - 从联合类型中排除
- ✅ `Extract<T, U>` - 从联合类型中提取
- ✅ `ReturnType<T>` - 获取函数返回类型
- ✅ `InstanceType<T>` - 获取构造函数实例类型
- ✅ `Parameters<T>` - 获取函数参数类型
- ✅ `ConstructorParameters<T>` - 获取构造函数参数类型
- ✅ `ThisParameterType<T>` - 获取函数this参数类型
- ✅ `OmitThisParameter<T>` - 移除函数this参数
- ✅ `ThisType<T>` - 标记this类型
- ✅ `Uppercase<S>` - 转换为大写
- ✅ `Lowercase<S>` - 转换为小写
- ✅ `Capitalize<S>` - 首字母大写
- ✅ `Uncapitalize<S>` - 首字母小写
- ✅ `NonNullable<T>` - 排除null和undefined
- ✅ `Awaited<T>` - 获取Promise的解析类型

### 9. 环境声明和类型声明

#### 声明文件
- ✅ 全局声明：`declare global`
- ✅ 模块声明：`declare module`
- ✅ 类型声明：`declare type`
- ✅ 变量声明：`declare var`
- ✅ 函数声明：`declare function`
- ✅ 类声明：`declare class`
- ✅ 接口声明：`declare interface`
- ✅ 枚举声明：`declare enum`
- ✅ 命名空间声明：`declare namespace`

#### 三斜杠指令
- ✅ `/// <reference path="...">`
- ✅ `/// <reference types="...">`
- ✅ `/// <reference lib="...">`

### 10. 代码智能提示

#### 自动完成
- ✅ 关键字和类型提示
- ✅ 函数签名提示
- ✅ 对象成员提示
- ✅ 泛型参数提示
- ✅ 导入/导出提示

#### 悬停提示
- ✅ 类型信息显示
- ✅ 函数签名显示
- ✅ 文档注释显示
- ✅ 定义位置显示

#### 跳转和引用
- ✅ 跳转到定义
- ✅ 查找所有引用
- ✅ 符号搜索
- ✅ 大纲视图

### 11. 语法高亮

#### 完整的语法高亮支持
- ✅ 关键字高亮
- ✅ 类型高亮
- ✅ 字符串和数字高亮
- ✅ 注释高亮
- ✅ 装饰器高亮
- ✅ 泛型高亮
- ✅ 模板字符串高亮
- ✅ JSX语法高亮

### 12. 代码片段

#### 丰富的代码片段
- ✅ 基础语法片段
- ✅ 函数和类片段
- ✅ 接口和类型片段
- ✅ 泛型片段
- ✅ 异步函数片段
- ✅ 装饰器片段
- ✅ 工具类型片段
- ✅ 条件类型片段

## 安装和使用

### 安装

1. 下载 `.vsix` 文件
2. 在VS Code中打开扩展面板
3. 选择"从VSIX安装..."
4. 选择下载的文件进行安装

### 使用

1. 创建 `.uts` 文件
2. 开始编写UTS代码
3. 享受完整的TypeScript语法支持

## 示例代码

```uts
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 接口定义
interface User {
    id: number;
    name: string;
    email?: string;
    readonly createdAt: Date;
}

// 类定义
class Calculator {
    private result: number = 0;

    constructor(initialValue: number = 0) {
        this.result = initialValue;
    }

    add(value: number): this {
        this.result += value;
        return this;
    }

    getResult(): number {
        return this.result;
    }
}

// 高级类型
type PartialUser = Partial<User>;
type UserKeys = keyof User;
type UserValues = User[UserKeys];

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 映射类型
type Readonly<T> = {
    readonly [K in keyof T]: T[K];
};

// 异步函数
async function fetchUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
}

// 装饰器
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with args:`, args);
        return originalMethod.apply(this, args);
    };
    return descriptor;
}

class Example {
    @log
    method(value: string): string {
        return `Processed: ${value}`;
    }
}
```

## 更新日志

### v0.1.0
- ✅ 完整的TypeScript语法支持
- ✅ 高级类型系统
- ✅ 装饰器支持
- ✅ 泛型和条件类型
- ✅ 映射类型和工具类型
- ✅ 模板字面量类型
- ✅ 异步函数和Promise
- ✅ 命名空间和模块
- ✅ 环境声明和类型声明
- ✅ 丰富的代码片段
- ✅ 完整的语法高亮
- ✅ 智能代码提示

## 贡献

欢迎提交问题和功能请求！

## 许可证

MIT License 