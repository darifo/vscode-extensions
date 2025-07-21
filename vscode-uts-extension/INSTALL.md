# UTS语言支持插件安装指南

## 安装方法

### 方法一：从VSIX文件安装（推荐）

1. 下载插件的VSIX文件
2. 在VS Code中按 `Ctrl+Shift+P`（或 `Cmd+Shift+P`）
3. 输入 "Extensions: Install from VSIX..."
4. 选择下载的VSIX文件
5. 重启VS Code

### 方法二：从源码安装

1. 克隆项目到本地
2. 在项目目录中运行：
   ```bash
   npm install
   npm run compile
   ```
3. 按 `F5` 启动调试模式
4. 在新打开的VS Code窗口中测试插件

### 方法三：开发模式安装

1. 在VS Code中打开插件项目
2. 按 `F5` 启动调试
3. 在新窗口中创建 `.uts` 文件进行测试

## 功能验证

安装插件后，可以通过以下方式验证功能：

### 1. 语法高亮
- 创建 `.uts` 文件
- 输入UTS代码，查看关键字、类型、字符串等是否正确高亮

### 2. 代码提示
- 在UTS文件中输入关键字（如 `let`、`function`、`class`）
- 查看是否出现自动补全提示

### 3. 对象成员提示
- 输入 `console.` 后查看是否提示 `log`、`error` 等方法
- 输入 `Array.` 后查看是否提示 `isArray`、`from` 等方法

### 4. 悬停提示
- 将鼠标悬停在关键字、类型、函数上
- 查看是否显示相关信息

### 5. 跳转定义
- 按住 `Ctrl`（或 `Cmd`）点击函数名、类名等
- 查看是否能跳转到定义位置

### 6. 大纲视图
- 打开大纲视图（View -> Outline）
- 查看是否显示文件中的函数、类、变量等符号

## 测试文件

项目包含以下测试文件：

- `test.uts` - 基本功能测试
- `demo.uts` - 完整功能演示

## 配置选项

在VS Code设置中可以配置以下选项：

```json
{
  "uts.suggest.enabled": true,      // 启用代码提示
  "uts.hover.enabled": true,        // 启用悬停提示
  "uts.definition.enabled": true    // 启用跳转到定义
}
```

## 快捷键

- `Ctrl+Space` - 触发代码提示
- `Ctrl+Click` - 跳转到定义
- `F12` - 跳转到定义
- `Shift+F12` - 查找所有引用
- `Ctrl+Shift+O` - 打开大纲视图

## 故障排除

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

## 开发调试

### 启动调试
1. 在插件项目中按 `F5`
2. 在新窗口中测试功能
3. 查看调试控制台输出

### 修改代码
1. 修改 `src/extension.ts` 文件
2. 运行 `npm run compile` 编译
3. 重新启动调试会话

### 查看日志
- 在调试控制台中查看插件日志
- 使用 `console.log` 输出调试信息

## 贡献

欢迎提交Issue和Pull Request来改进插件功能。

## 支持

如有问题，请：
1. 查看项目README文档
2. 提交GitHub Issue
3. 联系开发团队 