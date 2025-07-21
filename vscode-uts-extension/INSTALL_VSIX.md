# UTS语言支持插件 - VSIX安装指南

## 🎉 扩展文件已生成

VSIX扩展文件已成功生成：`vscode-uts-0.1.0.vsix`

## 📦 安装方法

### 方法一：通过VS Code界面安装（推荐）

1. 打开VS Code
2. 按 `Ctrl+Shift+P`（Windows/Linux）或 `Cmd+Shift+P`（macOS）
3. 输入 "Extensions: Install from VSIX..."
4. 选择 `vscode-uts-0.1.0.vsix` 文件
5. 点击 "Install"
6. 重启VS Code

### 方法二：通过命令行安装

```bash
code --install-extension vscode-uts-0.1.0.vsix
```

### 方法三：拖拽安装

1. 打开VS Code
2. 将 `vscode-uts-0.1.0.vsix` 文件拖拽到VS Code窗口中
3. 按照提示完成安装

## ✅ 安装验证

安装完成后，可以通过以下方式验证：

1. **检查插件列表**：
   - 打开扩展面板（Ctrl+Shift+X）
   - 搜索 "UTS"
   - 确认插件已安装并启用

2. **创建测试文件**：
   - 创建新文件，保存为 `.uts` 扩展名
   - 输入以下代码测试功能：

```uts
// 测试语法高亮
let message: string = "Hello UTS!";
const PI: number = 3.14159;

// 测试代码提示（输入 console. 应该会提示）
console.log("测试日志");

// 测试函数定义
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// 测试类定义
class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
}
```

3. **测试功能**：
   - **语法高亮**：查看关键字、类型、字符串是否正确高亮
   - **代码提示**：输入 `let`、`function`、`class` 等关键字
   - **对象成员提示**：输入 `console.` 后查看提示
   - **悬停提示**：将鼠标悬停在关键字上
   - **跳转定义**：Ctrl+Click 点击函数名

## 🚀 功能特性

### ✅ 已实现功能

- ✅ **语法高亮** - UTS关键字、类型、操作符高亮
- ✅ **代码提示** - 智能自动补全
- ✅ **对象成员提示** - console.、Array.、Object. 等
- ✅ **悬停提示** - 鼠标悬停显示说明
- ✅ **跳转定义** - Ctrl+Click 跳转到定义
- ✅ **代码片段** - 常用代码模板
- ✅ **大纲视图** - 显示文件符号结构
- ✅ **引用查找** - 查找所有引用

### 🎯 支持的语言特性

- **变量声明**：`let`、`const`、`var`
- **函数声明**：`function`、`async function`
- **类声明**：`class`、`interface`
- **类型系统**：`string`、`number`、`boolean`、`UTSJSONObject` 等
- **控制流**：`if`、`for`、`while`、`try-catch`
- **模块系统**：`import`、`export`
- **条件编译**：`#ifdef`、`#endif`

## 🔧 配置选项

在VS Code设置中可以配置：

```json
{
  "uts.suggest.enabled": true,      // 启用代码提示
  "uts.hover.enabled": true,        // 启用悬停提示
  "uts.definition.enabled": true    // 启用跳转到定义
}
```

## 📝 使用示例

### 代码提示示例

```uts
// 输入 let 会提示变量声明模板
let variableName: string = "value";

// 输入 function 会提示函数声明模板
function functionName(params): void {
    // function body
}

// 输入 console. 会提示成员方法
console.log("日志");
console.error("错误");
console.warn("警告");
```

### 对象成员提示示例

```uts
// Array 对象成员
const array = Array.isArray([1, 2, 3]);
const newArray = Array.from("字符串");

// Object 对象成员
const keys = Object.keys({name: "张三"});
const values = Object.values({name: "张三"});

// JSON 对象成员
const jsonString = JSON.stringify({name: "李四"});
const parsedObject = JSON.parse('{"name": "王五"}');

// Math 对象成员
const maxValue = Math.max(1, 2, 3, 4, 5);
const randomValue = Math.random();
```

## 🐛 故障排除

### 插件不工作
1. 检查文件扩展名是否为 `.uts`
2. 重启VS Code
3. 检查插件是否正确安装

### 代码提示不显示
1. 检查设置中的 `uts.suggest.enabled` 是否为 `true`
2. 确保文件语言模式为 "UTS"
3. 尝试重新加载窗口

### 语法高亮不正确
1. 检查文件是否被识别为UTS语言
2. 在状态栏查看语言模式
3. 手动选择语言模式为 "UTS"

## 📞 支持

如有问题，请：
1. 查看项目README文档
2. 提交GitHub Issue: https://github.com/darifo/vscode-extensions/issues
3. 联系开发团队

## 📄 许可证

本项目采用 MIT 许可证，详见 LICENSE 文件。

---

**版本**: 0.1.0  
**文件大小**: 23.1KB  
**支持平台**: Windows, macOS, Linux  
**VS Code版本**: ^1.74.0 