@echo off
chcp 65001 >nul

echo 🚀 UTS语言支持插件安装脚本
echo ================================

REM 检查VS Code是否安装
where code >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: VS Code未安装或未添加到PATH
    echo 请先安装VS Code: https://code.visualstudio.com/
    pause
    exit /b 1
)

REM 检查VSIX文件是否存在
if not exist "vscode-uts-0.1.0.vsix" (
    echo ❌ 错误: VSIX文件不存在
    echo 请先运行 'vsce package' 生成VSIX文件
    pause
    exit /b 1
)

echo ✅ 找到VSIX文件: vscode-uts-0.1.0.vsix
echo 📦 正在安装插件...

REM 安装插件
code --install-extension vscode-uts-0.1.0.vsix

if %errorlevel% equ 0 (
    echo ✅ 插件安装成功！
    echo.
    echo 🎉 安装完成！请重启VS Code以激活插件。
    echo.
    echo 📝 使用方法：
    echo 1. 创建 .uts 文件
    echo 2. 输入UTS代码体验功能
    echo 3. 查看 demo.uts 文件了解完整功能
    echo.
    echo 🔧 主要功能：
    echo - 语法高亮
    echo - 代码提示
    echo - 对象成员自动提示
    echo - 悬停提示
    echo - 跳转定义
    echo.
    echo 📖 详细文档请查看 INSTALL_VSIX.md
) else (
    echo ❌ 插件安装失败
    echo 请尝试手动安装：
    echo 1. 打开VS Code
    echo 2. 按 Ctrl+Shift+P
    echo 3. 输入 'Extensions: Install from VSIX...'
    echo 4. 选择 vscode-uts-0.1.0.vsix 文件
)

pause 