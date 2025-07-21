# UTS Language Support for VS Code

这是一个为VS Code提供UTS语言支持的插件，包含语法高亮、代码提示、悬停提示、跳转定义等功能。

## 功能特性

### 🎨 语法高亮
- 支持UTS关键字高亮
- 支持数据类型高亮
- 支持操作符高亮
- 支持字符串、注释高亮

### 💡 智能代码提示
- 关键字自动补全
- 数据类型提示
- 内置函数提示
- 代码片段支持

### 🔍 悬停提示
- 鼠标悬停显示语法定义信息
- 关键字说明
- 类型说明
- 函数说明

### 🚀 跳转功能
- 支持跳转到定义位置
- 支持查找所有引用
- 支持大纲视图显示符号

### 📝 代码片段
- 变量声明片段
- 函数定义片段
- 类定义片段
- 控制流语句片段

## 支持的UTS特性

### 关键字
- 变量声明：`let`, `const`, `var`
- 函数声明：`function`
- 类声明：`class`
- 接口声明：`interface`
- 类型声明：`type`
- 模块导入导出：`import`, `export`
- 访问修饰符：`public`, `private`, `protected`
- 其他关键字：`static`, `readonly`, `abstract`等

### 数据类型
- 基本类型：`string`, `number`, `boolean`
- 复杂类型：`object`, `array`, `any`
- 特殊类型：`void`, `never`, `unknown`
- UTS特有类型：`UTSJSONObject`, `UTSJSONValue`, `UTSArray`等

### 控制流
- 条件语句：`if`, `else`, `switch`, `case`
- 循环语句：`for`, `while`, `do`
- 跳转语句：`break`, `continue`, `return`
- 异常处理：`try`, `catch`, `finally`

## 使用方法

1. 安装插件后，VS Code会自动识别`.uts`文件
2. 在UTS文件中编写代码时会自动提供语法高亮和代码提示
3. 鼠标悬停在代码上会显示相关信息
4. 使用`Ctrl+Click`（或`Cmd+Click`）可以跳转到定义
5. 使用`F12`可以跳转到定义，`Shift+F12`可以查找所有引用

## 代码片段使用

在UTS文件中输入以下前缀可以快速插入代码片段：

- `let` - 声明变量
- `const` - 声明常量
- `function` - 声明函数
- `class` - 声明类
- `interface` - 声明接口
- `if` - if语句
- `for` - for循环
- `try` - try-catch语句

## 配置选项

在VS Code设置中可以配置以下选项：

- `uts.suggest.enabled` - 启用代码提示
- `uts.hover.enabled` - 启用悬停提示
- `uts.definition.enabled` - 启用跳转到定义

## 开发说明

### 项目结构
```
vscode-uts-extension/
├── src/                    # TypeScript源代码
│   └── extension.ts       # 主要扩展文件
├── syntaxes/              # 语法高亮配置
│   └── uts.tmLanguage.json
├── snippets/              # 代码片段
│   └── uts.json
├── package.json           # 插件配置
├── tsconfig.json          # TypeScript配置
└── README.md             # 说明文档
```

### 开发环境设置

1. 克隆项目
2. 运行 `npm install` 安装依赖
3. 运行 `npm run compile` 编译代码
4. 按 `F5` 启动调试

### 构建插件

```bash
npm run compile
```

## 安装方法

### 从VSIX文件安装

1. 下载 `vscode-uts-0.1.0.vsix` 文件
2. 在VS Code中按 `Ctrl+Shift+P`（或 `Cmd+Shift+P`）
3. 输入 "Extensions: Install from VSIX..."
4. 选择下载的VSIX文件
5. 重启VS Code

### 自动安装

```bash
# Linux/macOS
./install.sh

# Windows
install.bat
```

## 贡献

欢迎提交Issue和Pull Request来改进这个插件。

## 相关链接

- [UTS官方文档](https://doc.dcloud.net.cn/uni-app-x/uts/)
- [uni-app x文档](https://doc.dcloud.net.cn/uni-app-x/)
- [DCloud官网](https://www.dcloud.io/)
- [项目仓库](https://github.com/darifo/vscode-extensions)

## 许可证

MIT License

## 关于

本项目由 [darifo](https://github.com/darifo) 开发和维护。

---

**版本**: 0.1.0  
**支持平台**: Windows, macOS, Linux  
**VS Code版本**: ^1.74.0 