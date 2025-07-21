import * as vscode from 'vscode';

// UTS关键字和类型定义
const UTS_KEYWORDS = [
  'let', 'const', 'var', 'function', 'class', 'interface', 'type', 'namespace',
  'module', 'import', 'export', 'from', 'as', 'default', 'extends', 'implements',
  'static', 'public', 'private', 'protected', 'readonly', 'abstract', 'virtual',
  'override', 'sealed', 'final', 'enum', 'union', 'intersection', 'keyof',
  'typeof', 'infer', 'super', 'this', 'null', 'undefined', 'true', 'false'
];

const UTS_TYPES = [
  'string', 'number', 'boolean', 'object', 'array', 'any', 'void', 'never',
  'unknown', 'undefined', 'null', 'symbol', 'bigint', 'Date', 'RegExp', 'Error',
  'Function', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'ArrayBuffer',
  'DataView', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array',
  'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array',
  'BigInt64Array', 'BigUint64Array', 'UTSJSONObject', 'UTSJSONValue', 'UTSArray',
  'UTSString', 'UTSNumber', 'UTSBoolean'
];

const UTS_CONTROL_KEYWORDS = [
  'if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 'break',
  'continue', 'return', 'throw', 'try', 'catch', 'finally', 'in', 'of', 'new',
  'delete', 'void', 'with', 'yield', 'await', 'async'
];

// 内置函数和API
const UTS_BUILTIN_FUNCTIONS = [
  'console.log', 'console.error', 'console.warn', 'console.info',
  'Array.isArray', 'Object.keys', 'Object.values', 'Object.entries',
  'JSON.stringify', 'JSON.parse', 'parseInt', 'parseFloat',
  'isNaN', 'isFinite', 'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent'
];

// 对象成员变量映射
const OBJECT_MEMBERS = {
  'console': ['log', 'error', 'warn', 'info', 'debug', 'time', 'timeEnd'],
  'Array': ['isArray', 'from', 'of'],
  'Object': ['keys', 'values', 'entries', 'assign', 'create', 'defineProperty'],
  'JSON': ['stringify', 'parse'],
  'Math': ['abs', 'ceil', 'floor', 'round', 'max', 'min', 'pow', 'sqrt', 'random'],
  'String': ['fromCharCode', 'fromCodePoint'],
  'Number': ['isFinite', 'isInteger', 'isNaN', 'parseInt', 'parseFloat'],
  'Date': ['now', 'parse', 'UTC'],
  'RegExp': ['test', 'exec'],
  'Promise': ['resolve', 'reject', 'all', 'race', 'allSettled'],
  'Map': ['set', 'get', 'has', 'delete', 'clear', 'size'],
  'Set': ['add', 'has', 'delete', 'clear', 'size'],
  'UTSJSONObject': ['get', 'set', 'has', 'delete', 'keys', 'values', 'entries'],
  'UTSArray': ['push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'indexOf', 'includes']
};

export function activate(context: vscode.ExtensionContext) {
  console.log('UTS语言支持插件已激活');

  // 注册代码提示提供者
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'uts' },
    new UTSCompletionProvider(),
    '.', ':', ' '
  );

  // 注册悬停提示提供者
  const hoverProvider = vscode.languages.registerHoverProvider(
    { language: 'uts' },
    new UTSHoverProvider()
  );

  // 注册定义提供者
  const definitionProvider = vscode.languages.registerDefinitionProvider(
    { language: 'uts' },
    new UTSDefinitionProvider()
  );

  // 注册符号提供者
  const documentSymbolProvider = vscode.languages.registerDocumentSymbolProvider(
    { language: 'uts' },
    new UTSDocumentSymbolProvider()
  );

  // 注册引用提供者
  const referenceProvider = vscode.languages.registerReferenceProvider(
    { language: 'uts' },
    new UTSReferenceProvider()
  );

  // 注册签名帮助提供者
  const signatureHelpProvider = vscode.languages.registerSignatureHelpProvider(
    { language: 'uts' },
    new UTSSignatureHelpProvider(),
    '(', ','
  );

  context.subscriptions.push(
    completionProvider,
    hoverProvider,
    definitionProvider,
    documentSymbolProvider,
    referenceProvider,
    signatureHelpProvider
  );
}

// 代码提示提供者
class UTSCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    const items: vscode.CompletionItem[] = [];

    // 检查是否在对象成员访问上下文中
    const line = document.lineAt(position.line).text;
    const beforeCursor = line.substring(0, position.character);
    
    // 检查是否在点号后面
    const dotMatch = beforeCursor.match(/(\w+)\.$/);
    if (dotMatch) {
      const objectName = dotMatch[1];
      const members = OBJECT_MEMBERS[objectName as keyof typeof OBJECT_MEMBERS];
      
      if (members) {
        members.forEach(member => {
          const item = new vscode.CompletionItem(member, vscode.CompletionItemKind.Method);
          item.detail = `${objectName} 的成员`;
          item.documentation = `访问 ${objectName} 对象的 ${member} 成员`;
          items.push(item);
        });
        return items;
      }
    }

    // 检查是否在冒号后面（类型注解）
    const colonMatch = beforeCursor.match(/:\s*$/);
    if (colonMatch) {
      // 添加类型提示
      UTS_TYPES.forEach(type => {
        const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
        item.detail = 'UTS类型';
        items.push(item);
      });
      return items;
    }

    // 添加关键字
    UTS_KEYWORDS.forEach(keyword => {
      const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
      item.detail = 'UTS关键字';
      items.push(item);
    });

    // 添加类型
    UTS_TYPES.forEach(type => {
      const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
      item.detail = 'UTS类型';
      items.push(item);
    });

    // 添加控制关键字
    UTS_CONTROL_KEYWORDS.forEach(keyword => {
      const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
      item.detail = 'UTS控制关键字';
      items.push(item);
    });

    // 添加内置函数
    UTS_BUILTIN_FUNCTIONS.forEach(func => {
      const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
      item.detail = 'UTS内置函数';
      items.push(item);
    });

    // 添加常用代码片段
    const snippets = [
      { label: 'let', insertText: 'let ${1:variableName}: ${2:string} = ${3:"value"};', detail: '声明变量' },
      { label: 'const', insertText: 'const ${1:constantName}: ${2:string} = ${3:"value"};', detail: '声明常量' },
      { label: 'function', insertText: 'function ${1:functionName}(${2:params}): ${3:void} {\n\t${4:// function body}\n}', detail: '声明函数' },
      { label: 'class', insertText: 'class ${1:ClassName} {\n\t${2:// class members}\n}', detail: '声明类' },
      { label: 'interface', insertText: 'interface ${1:InterfaceName} {\n\t${2:// interface members}\n}', detail: '声明接口' },
      { label: 'if', insertText: 'if (${1:condition}) {\n\t${2:// if body}\n}', detail: 'if语句' },
      { label: 'for', insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// loop body}\n}', detail: 'for循环' },
      { label: 'try', insertText: 'try {\n\t${1:// try body}\n} catch (${2:error}) {\n\t${3:// catch body}\n}', detail: 'try-catch语句' },
      { label: 'async', insertText: 'async function ${1:functionName}(${2:params}): Promise<${3:void}> {\n\t${4:// async function body}\n}', detail: '异步函数' },
      { label: 'await', insertText: 'const ${1:result} = await ${2:promise};', detail: 'await语句' }
    ];

    snippets.forEach(snippet => {
      const item = new vscode.CompletionItem(snippet.label, vscode.CompletionItemKind.Snippet);
      item.insertText = new vscode.SnippetString(snippet.insertText);
      item.detail = snippet.detail;
      items.push(item);
    });

    return items;
  }
}

// 悬停提示提供者
class UTSHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return null;

    const word = document.getText(range);
    
    // 检查是否在对象成员访问上下文中
    const line = document.lineAt(position.line).text;
    const beforeCursor = line.substring(0, position.character);
    const dotMatch = beforeCursor.match(/(\w+)\.(\w+)$/);
    
    if (dotMatch) {
      const objectName = dotMatch[1];
      const memberName = dotMatch[2];
      const members = OBJECT_MEMBERS[objectName as keyof typeof OBJECT_MEMBERS];
      
      if (members && members.includes(memberName)) {
        return new vscode.Hover([
          `**${objectName}.${memberName}** - 对象成员`,
          `${objectName} 对象的 ${memberName} 方法或属性`
        ]);
      }
    }
    
    // 关键字说明
    if (UTS_KEYWORDS.includes(word)) {
      return new vscode.Hover([
        `**${word}** - UTS关键字`,
        `用于声明变量、常量、函数等`
      ]);
    }

    // 类型说明
    if (UTS_TYPES.includes(word)) {
      return new vscode.Hover([
        `**${word}** - UTS类型`,
        `UTS语言支持的数据类型`
      ]);
    }

    // 控制关键字说明
    if (UTS_CONTROL_KEYWORDS.includes(word)) {
      return new vscode.Hover([
        `**${word}** - UTS控制关键字`,
        `用于控制程序流程`
      ]);
    }

    // 内置函数说明
    if (UTS_BUILTIN_FUNCTIONS.includes(word)) {
      return new vscode.Hover([
        `**${word}** - UTS内置函数`,
        `UTS语言提供的内置功能`
      ]);
    }

    return null;
  }
}

// 定义提供者
class UTSDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return null;

    const word = document.getText(range);
    
    // 在文档中查找定义
    const text = document.getText();
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 查找函数定义
      const functionMatch = line.match(new RegExp(`function\\s+${word}\\s*\\(`));
      if (functionMatch) {
        return new vscode.Location(document.uri, new vscode.Position(i, line.indexOf('function')));
      }
      
      // 查找类定义
      const classMatch = line.match(new RegExp(`class\\s+${word}\\s*`));
      if (classMatch) {
        return new vscode.Location(document.uri, new vscode.Position(i, line.indexOf('class')));
      }
      
      // 查找接口定义
      const interfaceMatch = line.match(new RegExp(`interface\\s+${word}\\s*`));
      if (interfaceMatch) {
        return new vscode.Location(document.uri, new vscode.Position(i, line.indexOf('interface')));
      }
      
      // 查找变量定义
      const varMatch = line.match(new RegExp(`(let|const|var)\\s+${word}\\s*:`));
      if (varMatch) {
        return new vscode.Location(document.uri, new vscode.Position(i, line.indexOf(varMatch[1])));
      }
    }
    
    return null;
  }
}

// 文档符号提供者
class UTSDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
    const symbols: vscode.DocumentSymbol[] = [];
    const text = document.getText();

    // 简单的符号解析（实际应用中需要更复杂的解析器）
    const lines = text.split('\n');
    
    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      
      // 匹配函数定义
      const functionMatch = trimmedLine.match(/function\s+(\w+)/);
      if (functionMatch) {
        const symbol = new vscode.DocumentSymbol(
          functionMatch[1],
          '函数',
          vscode.SymbolKind.Function,
          new vscode.Range(lineIndex, 0, lineIndex, line.length),
          new vscode.Range(lineIndex, 0, lineIndex, line.length)
        );
        symbols.push(symbol);
      }

      // 匹配类定义
      const classMatch = trimmedLine.match(/class\s+(\w+)/);
      if (classMatch) {
        const symbol = new vscode.DocumentSymbol(
          classMatch[1],
          '类',
          vscode.SymbolKind.Class,
          new vscode.Range(lineIndex, 0, lineIndex, line.length),
          new vscode.Range(lineIndex, 0, lineIndex, line.length)
        );
        symbols.push(symbol);
      }

      // 匹配接口定义
      const interfaceMatch = trimmedLine.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        const symbol = new vscode.DocumentSymbol(
          interfaceMatch[1],
          '接口',
          vscode.SymbolKind.Interface,
          new vscode.Range(lineIndex, 0, lineIndex, line.length),
          new vscode.Range(lineIndex, 0, lineIndex, line.length)
        );
        symbols.push(symbol);
      }

      // 匹配变量定义
      const varMatch = trimmedLine.match(/(let|const|var)\s+(\w+)/);
      if (varMatch) {
        const symbol = new vscode.DocumentSymbol(
          varMatch[2],
          '变量',
          vscode.SymbolKind.Variable,
          new vscode.Range(lineIndex, 0, lineIndex, line.length),
          new vscode.Range(lineIndex, 0, lineIndex, line.length)
        );
        symbols.push(symbol);
      }
    });

    return symbols;
  }
}

// 引用提供者
class UTSReferenceProvider implements vscode.ReferenceProvider {
  provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ReferenceContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Location[]> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return [];

    const word = document.getText(range);
    const locations: vscode.Location[] = [];

    // 在当前文档中查找所有匹配的单词
    const text = document.getText();
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    let match;

    while ((match = regex.exec(text)) !== null) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const location = new vscode.Location(document.uri, new vscode.Range(startPos, endPos));
      locations.push(location);
    }

    return locations;
  }
}

// 签名帮助提供者
class UTSSignatureHelpProvider implements vscode.SignatureHelpProvider {
  provideSignatureHelp(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.SignatureHelpContext
  ): vscode.ProviderResult<vscode.SignatureHelp> {
    // 这里可以实现函数签名的帮助信息
    // 目前返回空实现
    return null;
  }
}

export function deactivate() {
  console.log('UTS语言支持插件已停用');
} 