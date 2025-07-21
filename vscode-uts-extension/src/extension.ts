import * as vscode from 'vscode';
import { UTSLanguageServer } from './languageServer';

// UTS关键字和类型定义
const UTS_KEYWORDS = [
  'let', 'const', 'var', 'function', 'class', 'interface', 'type', 'namespace',
  'module', 'import', 'export', 'from', 'as', 'default', 'extends', 'implements',
  'static', 'public', 'private', 'protected', 'readonly', 'abstract', 'virtual',
  'override', 'sealed', 'final', 'enum', 'union', 'intersection', 'keyof',
  'typeof', 'infer', 'super', 'this', 'null', 'undefined', 'true', 'false',
  'declare', 'namespace', 'module', 'export', 'import', 'from', 'as', 'default',
  'extends', 'implements', 'static', 'public', 'private', 'protected', 'readonly',
  'abstract', 'virtual', 'override', 'sealed', 'final', 'enum', 'union', 'intersection',
  'keyof', 'typeof', 'infer', 'super', 'this', 'null', 'undefined', 'true', 'false',
  'any', 'unknown', 'never', 'void', 'object', 'string', 'number', 'boolean', 'symbol',
  'bigint', 'Date', 'RegExp', 'Error', 'Function', 'Promise', 'Map', 'Set', 'WeakMap',
  'WeakSet', 'ArrayBuffer', 'DataView', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray',
  'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array',
  'BigInt64Array', 'BigUint64Array', 'UTSJSONObject', 'UTSJSONValue', 'UTSArray',
  'UTSString', 'UTSNumber', 'UTSBoolean'
];

const UTS_TYPES = [
  'string', 'number', 'boolean', 'object', 'array', 'any', 'void', 'never',
  'unknown', 'undefined', 'null', 'symbol', 'bigint', 'Date', 'RegExp', 'Error',
  'Function', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet', 'ArrayBuffer',
  'DataView', 'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array',
  'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array',
  'BigInt64Array', 'BigUint64Array', 'UTSJSONObject', 'UTSJSONValue', 'UTSArray',
  'UTSString', 'UTSNumber', 'UTSBoolean', 'Array', 'ReadonlyArray', 'Partial',
  'Required', 'Readonly', 'Pick', 'Record', 'Exclude', 'Extract', 'ReturnType',
  'InstanceType', 'Parameters', 'ConstructorParameters', 'ThisParameterType',
  'OmitThisParameter', 'ThisType', 'Uppercase', 'Lowercase', 'Capitalize',
  'Uncapitalize', 'NonNullable', 'ThisType', 'Intrinsic', 'Unique', 'Brand'
];

const UTS_CONTROL_KEYWORDS = [
  'if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 'break',
  'continue', 'return', 'throw', 'try', 'catch', 'finally', 'in', 'of', 'new',
  'delete', 'void', 'with', 'yield', 'await', 'async', 'from', 'of', 'in',
  'instanceof', 'typeof', 'as', 'is', 'satisfies', 'const', 'let', 'var',
  'function', 'class', 'interface', 'type', 'enum', 'namespace', 'module',
  'import', 'export', 'default', 'extends', 'implements', 'static', 'public',
  'private', 'protected', 'readonly', 'abstract', 'virtual', 'override', 'sealed',
  'final', 'union', 'intersection', 'keyof', 'typeof', 'infer', 'super', 'this'
];

// 内置函数和API
const UTS_BUILTIN_FUNCTIONS = [
  'console.log', 'console.error', 'console.warn', 'console.info',
  'Array.isArray', 'Object.keys', 'Object.values', 'Object.entries',
  'JSON.stringify', 'JSON.parse', 'parseInt', 'parseFloat',
  'isNaN', 'isFinite', 'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
  'Math.abs', 'Math.ceil', 'Math.floor', 'Math.round', 'Math.max', 'Math.min',
  'Math.pow', 'Math.sqrt', 'Math.random', 'Math.sin', 'Math.cos', 'Math.tan',
  'Math.asin', 'Math.acos', 'Math.atan', 'Math.atan2', 'Math.exp', 'Math.log',
  'Math.log10', 'Math.log2', 'Math.cbrt', 'Math.hypot', 'Math.trunc', 'Math.sign',
  'String.fromCharCode', 'String.fromCodePoint', 'String.raw', 'String.prototype.charAt',
  'String.prototype.charCodeAt', 'String.prototype.codePointAt', 'String.prototype.concat',
  'String.prototype.includes', 'String.prototype.indexOf', 'String.prototype.lastIndexOf',
  'String.prototype.localeCompare', 'String.prototype.match', 'String.prototype.normalize',
  'String.prototype.padEnd', 'String.prototype.padStart', 'String.prototype.repeat',
  'String.prototype.replace', 'String.prototype.search', 'String.prototype.slice',
  'String.prototype.split', 'String.prototype.startsWith', 'String.prototype.substring',
  'String.prototype.toLowerCase', 'String.prototype.toUpperCase', 'String.prototype.trim',
  'Number.isFinite', 'Number.isInteger', 'Number.isNaN', 'Number.isSafeInteger',
  'Number.parseFloat', 'Number.parseInt', 'Number.MAX_VALUE', 'Number.MIN_VALUE',
  'Number.MAX_SAFE_INTEGER', 'Number.MIN_SAFE_INTEGER', 'Number.NEGATIVE_INFINITY',
  'Number.POSITIVE_INFINITY', 'Number.NaN', 'Number.EPSILON'
];

// 对象成员变量映射
const OBJECT_MEMBERS = {
  'console': ['log', 'error', 'warn', 'info', 'debug', 'time', 'timeEnd', 'timeLog', 'trace', 'assert', 'count', 'countReset', 'group', 'groupCollapsed', 'groupEnd', 'table', 'clear'],
  'Array': ['isArray', 'from', 'of', 'prototype'],
  'Object': ['keys', 'values', 'entries', 'assign', 'create', 'defineProperty', 'defineProperties', 'getOwnPropertyDescriptor', 'getOwnPropertyDescriptors', 'getOwnPropertyNames', 'getOwnPropertySymbols', 'getPrototypeOf', 'is', 'isExtensible', 'isFrozen', 'isSealed', 'preventExtensions', 'seal', 'freeze', 'setPrototypeOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', 'toLocaleString'],
  'JSON': ['stringify', 'parse'],
  'Math': ['abs', 'ceil', 'floor', 'round', 'max', 'min', 'pow', 'sqrt', 'random', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'atan2', 'exp', 'log', 'log10', 'log2', 'cbrt', 'hypot', 'trunc', 'sign', 'PI', 'E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'SQRT1_2', 'SQRT2'],
  'String': ['fromCharCode', 'fromCodePoint', 'raw', 'prototype'],
  'Number': ['isFinite', 'isInteger', 'isNaN', 'isSafeInteger', 'parseFloat', 'parseInt', 'MAX_VALUE', 'MIN_VALUE', 'MAX_SAFE_INTEGER', 'MIN_SAFE_INTEGER', 'NEGATIVE_INFINITY', 'POSITIVE_INFINITY', 'NaN', 'EPSILON'],
  'Date': ['now', 'parse', 'UTC', 'prototype'],
  'RegExp': ['test', 'exec', 'prototype'],
  'Promise': ['resolve', 'reject', 'all', 'race', 'allSettled', 'any', 'prototype'],
  'Map': ['set', 'get', 'has', 'delete', 'clear', 'size', 'keys', 'values', 'entries', 'forEach', 'prototype'],
  'Set': ['add', 'has', 'delete', 'clear', 'size', 'keys', 'values', 'entries', 'forEach', 'prototype'],
  'WeakMap': ['set', 'get', 'has', 'delete', 'prototype'],
  'WeakSet': ['add', 'has', 'delete', 'prototype'],
  'ArrayBuffer': ['prototype', 'isView'],
  'DataView': ['prototype'],
  'Int8Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'Uint8Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'Uint8ClampedArray': ['prototype', 'BYTES_PER_ELEMENT'],
  'Int16Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'Uint16Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'Int32Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'Uint32Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'Float32Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'Float64Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'BigInt64Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'BigUint64Array': ['prototype', 'BYTES_PER_ELEMENT'],
  'UTSJSONObject': ['get', 'set', 'has', 'delete', 'keys', 'values', 'entries'],
  'UTSArray': ['push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'indexOf', 'includes', 'forEach', 'map', 'filter', 'reduce', 'reduceRight', 'find', 'findIndex', 'some', 'every', 'join', 'reverse', 'sort', 'concat', 'toString', 'toLocaleString', 'valueOf', 'length']
};

// 类方法映射
const CLASS_METHODS = {
  'User': {
    'getInfo': 'getInfo(): string - 获取用户信息',
    'validateEmail': 'validateEmail(): boolean - 验证邮箱格式'
  },
  'Calculator': {
    'add': 'add(value: number): void - 加法运算',
    'subtract': 'subtract(value: number): void - 减法运算',
    'getResult': 'getResult(): number - 获取计算结果'
  },
  'Car': {
    'start': 'start(): void - 启动汽车',
    'stop': 'stop(): void - 停止汽车'
  }
};

// 函数签名信息
const FUNCTION_SIGNATURES = {
  'console.log': 'log(message: any): void - 输出日志信息',
  'console.error': 'error(message: any): void - 输出错误信息',
  'console.warn': 'warn(message: any): void - 输出警告信息',
  'console.info': 'info(message: any): void - 输出信息',
  'console.debug': 'debug(message: any): void - 输出调试信息',
  'console.trace': 'trace(message?: any): void - 输出堆栈跟踪',
  'console.assert': 'assert(condition: any, message?: string): void - 断言',
  'console.count': 'count(label?: string): void - 计数器',
  'console.countReset': 'countReset(label?: string): void - 重置计数器',
  'console.time': 'time(label: string): void - 开始计时',
  'console.timeEnd': 'timeEnd(label: string): void - 结束计时',
  'console.timeLog': 'timeLog(label: string, ...data: any[]): void - 输出计时信息',
  'console.group': 'group(label?: string): void - 开始分组',
  'console.groupCollapsed': 'groupCollapsed(label?: string): void - 开始折叠分组',
  'console.groupEnd': 'groupEnd(): void - 结束分组',
  'console.table': 'table(data: any, columns?: string[]): void - 输出表格',
  'console.clear': 'clear(): void - 清空控制台',
  'Array.isArray': 'isArray(value: any): boolean - 检查是否为数组',
  'Array.from': 'from(arrayLike: any, mapfn?: (value: any, index: number) => any): Array<any> - 从类数组对象创建数组',
  'Array.of': 'of(...items: any[]): Array<any> - 创建数组',
  'Object.keys': 'keys(obj: object): string[] - 获取对象的所有键',
  'Object.values': 'values(obj: object): any[] - 获取对象的所有值',
  'Object.entries': 'entries(obj: object): [string, any][] - 获取对象的所有键值对',
  'Object.assign': 'assign(target: object, ...sources: object[]): object - 合并对象',
  'Object.create': 'create(proto: object, properties?: object): object - 创建对象',
  'Object.defineProperty': 'defineProperty(obj: object, prop: string, descriptor: PropertyDescriptor): object - 定义属性',
  'Object.defineProperties': 'defineProperties(obj: object, props: object): object - 定义多个属性',
  'Object.getOwnPropertyDescriptor': 'getOwnPropertyDescriptor(obj: object, prop: string): PropertyDescriptor | undefined - 获取属性描述符',
  'Object.getOwnPropertyDescriptors': 'getOwnPropertyDescriptors(obj: object): object - 获取所有属性描述符',
  'Object.getOwnPropertyNames': 'getOwnPropertyNames(obj: object): string[] - 获取所有属性名',
  'Object.getOwnPropertySymbols': 'getOwnPropertySymbols(obj: object): symbol[] - 获取所有Symbol属性',
  'Object.getPrototypeOf': 'getPrototypeOf(obj: object): object | null - 获取原型',
  'Object.is': 'is(value1: any, value2: any): boolean - 比较值',
  'Object.isExtensible': 'isExtensible(obj: object): boolean - 检查是否可扩展',
  'Object.isFrozen': 'isFrozen(obj: object): boolean - 检查是否冻结',
  'Object.isSealed': 'isSealed(obj: object): boolean - 检查是否密封',
  'Object.preventExtensions': 'preventExtensions(obj: object): object - 阻止扩展',
  'Object.seal': 'seal(obj: object): object - 密封对象',
  'Object.freeze': 'freeze(obj: object): object - 冻结对象',
  'Object.setPrototypeOf': 'setPrototypeOf(obj: object, proto: object | null): object - 设置原型',
  'JSON.stringify': 'stringify(value: any, replacer?: (key: string, value: any) => any | number[] | null, space?: string | number): string - 将对象转换为JSON字符串',
  'JSON.parse': 'parse(text: string, reviver?: (key: string, value: any) => any): any - 解析JSON字符串',
  'Math.abs': 'abs(x: number): number - 绝对值',
  'Math.ceil': 'ceil(x: number): number - 向上取整',
  'Math.floor': 'floor(x: number): number - 向下取整',
  'Math.round': 'round(x: number): number - 四舍五入',
  'Math.max': 'max(...values: number[]): number - 返回最大值',
  'Math.min': 'min(...values: number[]): number - 返回最小值',
  'Math.pow': 'pow(base: number, exponent: number): number - 计算幂',
  'Math.sqrt': 'sqrt(x: number): number - 计算平方根',
  'Math.random': 'random(): number - 返回0到1之间的随机数',
  'Math.sin': 'sin(x: number): number - 正弦函数',
  'Math.cos': 'cos(x: number): number - 余弦函数',
  'Math.tan': 'tan(x: number): number - 正切函数',
  'Math.asin': 'asin(x: number): number - 反正弦函数',
  'Math.acos': 'acos(x: number): number - 反余弦函数',
  'Math.atan': 'atan(x: number): number - 反正切函数',
  'Math.atan2': 'atan2(y: number, x: number): number - 反正切函数',
  'Math.exp': 'exp(x: number): number - 指数函数',
  'Math.log': 'log(x: number): number - 自然对数',
  'Math.log10': 'log10(x: number): number - 以10为底的对数',
  'Math.log2': 'log2(x: number): number - 以2为底的对数',
  'Math.cbrt': 'cbrt(x: number): number - 立方根',
  'Math.hypot': 'hypot(...values: number[]): number - 平方和的平方根',
  'Math.trunc': 'trunc(x: number): number - 截断小数部分',
  'Math.sign': 'sign(x: number): number - 符号函数',
  'String.fromCharCode': 'fromCharCode(...codes: number[]): string - 从字符代码创建字符串',
  'String.fromCodePoint': 'fromCodePoint(...codePoints: number[]): string - 从代码点创建字符串',
  'String.raw': 'raw(template: TemplateStringsArray, ...substitutions: any[]): string - 原始字符串',
  'Number.isFinite': 'isFinite(value: number): boolean - 检查是否为有限数',
  'Number.isInteger': 'isInteger(value: number): boolean - 检查是否为整数',
  'Number.isNaN': 'isNaN(value: number): boolean - 检查是否为NaN',
  'Number.isSafeInteger': 'isSafeInteger(value: number): boolean - 检查是否为安全整数',
  'Number.parseFloat': 'parseFloat(string: string): number - 解析浮点数',
  'Number.parseInt': 'parseInt(string: string, radix?: number): number - 解析整数',
  'parseInt': 'parseInt(string: string, radix?: number): number - 解析整数',
  'parseFloat': 'parseFloat(string: string): number - 解析浮点数',
  'isNaN': 'isNaN(value: number): boolean - 检查是否为NaN',
  'isFinite': 'isFinite(value: number): boolean - 检查是否为有限数',
  'encodeURI': 'encodeURI(uri: string): string - 编码URI',
  'decodeURI': 'decodeURI(encodedURI: string): string - 解码URI',
  'encodeURIComponent': 'encodeURIComponent(uriComponent: string): string - 编码URI组件',
  'decodeURIComponent': 'decodeURIComponent(encodedURIComponent: string): string - 解码URI组件'
};

// 类型说明信息
const TYPE_DESCRIPTIONS = {
  'string': '字符串类型，用于表示文本数据',
  'number': '数字类型，包括整数和浮点数',
  'boolean': '布尔类型，true或false',
  'object': '对象类型，键值对的集合',
  'array': '数组类型，有序的元素集合',
  'any': '任意类型，可以接受任何值',
  'void': '空类型，表示没有返回值',
  'never': '永不类型，表示永远不会发生的值',
  'unknown': '未知类型，比any更安全的类型',
  'undefined': '未定义类型',
  'null': '空值类型',
  'symbol': '符号类型，唯一的标识符',
  'bigint': '大整数类型，用于表示任意精度的整数',
  'Date': '日期类型，表示日期和时间',
  'RegExp': '正则表达式类型',
  'Error': '错误类型',
  'Function': '函数类型',
  'Promise': 'Promise类型，用于异步操作',
  'Map': 'Map类型，键值对集合',
  'Set': 'Set类型，唯一值的集合',
  'WeakMap': 'WeakMap类型，弱引用键值对集合',
  'WeakSet': 'WeakSet类型，弱引用唯一值集合',
  'ArrayBuffer': 'ArrayBuffer类型，固定长度的原始二进制数据缓冲区',
  'DataView': 'DataView类型，从ArrayBuffer读写多种数值类型的底层接口',
  'Int8Array': 'Int8Array类型，8位有符号整数数组',
  'Uint8Array': 'Uint8Array类型，8位无符号整数数组',
  'Uint8ClampedArray': 'Uint8ClampedArray类型，8位无符号整数数组（值被限制在0-255）',
  'Int16Array': 'Int16Array类型，16位有符号整数数组',
  'Uint16Array': 'Uint16Array类型，16位无符号整数数组',
  'Int32Array': 'Int32Array类型，32位有符号整数数组',
  'Uint32Array': 'Uint32Array类型，32位无符号整数数组',
  'Float32Array': 'Float32Array类型，32位浮点数数组',
  'Float64Array': 'Float64Array类型，64位浮点数数组',
  'BigInt64Array': 'BigInt64Array类型，64位有符号大整数数组',
  'BigUint64Array': 'BigUint64Array类型，64位无符号大整数数组',
  'Array': 'Array类型，泛型数组类型',
  'ReadonlyArray': 'ReadonlyArray类型，只读数组类型',
  'Partial': 'Partial类型，将所有属性变为可选的工具类型',
  'Required': 'Required类型，将所有属性变为必需的工具类型',
  'Readonly': 'Readonly类型，将所有属性变为只读的工具类型',
  'Pick': 'Pick类型，从对象类型中选择指定属性的工具类型',
  'Record': 'Record类型，创建键值对类型的工具类型',
  'Exclude': 'Exclude类型，从联合类型中排除指定类型的工具类型',
  'Extract': 'Extract类型，从联合类型中提取指定类型的工具类型',
  'ReturnType': 'ReturnType类型，获取函数返回类型的工具类型',
  'InstanceType': 'InstanceType类型，获取构造函数实例类型的工具类型',
  'Parameters': 'Parameters类型，获取函数参数类型的工具类型',
  'ConstructorParameters': 'ConstructorParameters类型，获取构造函数参数类型的工具类型',
  'ThisParameterType': 'ThisParameterType类型，获取函数this参数类型的工具类型',
  'OmitThisParameter': 'OmitThisParameter类型，移除函数this参数的工具类型',
  'ThisType': 'ThisType类型，标记this类型的工具类型',
  'Uppercase': 'Uppercase类型，将字符串转换为大写的工具类型',
  'Lowercase': 'Lowercase类型，将字符串转换为小写的工具类型',
  'Capitalize': 'Capitalize类型，将字符串首字母大写的工具类型',
  'Uncapitalize': 'Uncapitalize类型，将字符串首字母小写的工具类型',
  'NonNullable': 'NonNullable类型，从类型中排除null和undefined的工具类型',
  'Intrinsic': 'Intrinsic类型，内置类型',
  'Unique': 'Unique类型，唯一类型',
  'Brand': 'Brand类型，品牌类型',
  'UTSJSONObject': 'UTS JSON对象类型，用于处理JSON数据',
  'UTSJSONValue': 'UTS JSON值类型',
  'UTSArray': 'UTS数组类型',
  'UTSString': 'UTS字符串类型',
  'UTSNumber': 'UTS数字类型',
  'UTSBoolean': 'UTS布尔类型'
};

export function activate(context: vscode.ExtensionContext) {
  console.log('UTS语言支持插件已激活');

  // 初始化语言服务器
  const languageServer = new UTSLanguageServer();
  languageServer.initialize();

  // 注册代码提示提供者
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'uts' },
    new UTSCompletionProvider(languageServer),
    '.', ':', ' ', '('
  );

  // 注册悬停提示提供者
  const hoverProvider = vscode.languages.registerHoverProvider(
    { language: 'uts' },
    new UTSHoverProvider(languageServer)
  );

  // 注册定义提供者
  const definitionProvider = vscode.languages.registerDefinitionProvider(
    { language: 'uts' },
    new UTSDefinitionProvider(languageServer)
  );

  // 注册符号提供者
  const documentSymbolProvider = vscode.languages.registerDocumentSymbolProvider(
    { language: 'uts' },
    new UTSDocumentSymbolProvider(languageServer)
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
  constructor(private languageServer?: UTSLanguageServer) {}
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    // 如果语言服务器可用，使用它获取完成项
    if (this.languageServer) {
      return this.languageServer.getCompletionItems(document, position);
    }

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
          
          // 添加函数签名信息
          const signature = FUNCTION_SIGNATURES[`${objectName}.${member}` as keyof typeof FUNCTION_SIGNATURES];
          if (signature) {
            item.documentation = new vscode.MarkdownString(signature);
          }
          
          items.push(item);
        });
        return items;
      }

      // 检查是否为类实例方法
      const classMethods = CLASS_METHODS[objectName as keyof typeof CLASS_METHODS];
      if (classMethods) {
        Object.entries(classMethods).forEach(([methodName, signature]) => {
          const item = new vscode.CompletionItem(methodName, vscode.CompletionItemKind.Method);
          item.detail = `${objectName} 类的方法`;
          item.documentation = new vscode.MarkdownString(signature);
          items.push(item);
        });
        return items;
      }

      // 动态检测类定义中的方法
      const text = document.getText();
      const lines = text.split('\n');
      
      // 查找类定义
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const classMatch = line.match(new RegExp(`class\\s+${objectName}\\s*`));
        if (classMatch) {
          // 在类定义中查找方法
          for (let j = i + 1; j < lines.length; j++) {
            const methodLine = lines[j];
            // 检查是否到达类结束
            if (methodLine.trim() === '}') break;
            
            // 查找方法定义
            const methodMatch = methodLine.match(/(\w+)\s*\([^)]*\)\s*:\s*([^{]+)/);
            if (methodMatch) {
              const methodName = methodMatch[1];
              const returnType = methodMatch[2].trim();
              const item = new vscode.CompletionItem(methodName, vscode.CompletionItemKind.Method);
              item.detail = `${objectName} 类的方法`;
              item.documentation = new vscode.MarkdownString(`${methodName}(): ${returnType} - ${objectName} 类的方法`);
              items.push(item);
            }
          }
          return items;
        }
      }
    }

    // 检查是否在冒号后面（类型注解）
    const colonMatch = beforeCursor.match(/:\s*$/);
    if (colonMatch) {
      // 添加类型提示
      UTS_TYPES.forEach(type => {
        const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
        item.detail = 'UTS类型';
        item.documentation = TYPE_DESCRIPTIONS[type as keyof typeof TYPE_DESCRIPTIONS] || 'UTS语言支持的数据类型';
        items.push(item);
      });
      return items;
    }

    // 检查是否在函数调用上下文中
    const functionCallMatch = beforeCursor.match(/(\w+)\($/);
    if (functionCallMatch) {
      const functionName = functionCallMatch[1];
      const signature = FUNCTION_SIGNATURES[functionName as keyof typeof FUNCTION_SIGNATURES];
      if (signature) {
        const item = new vscode.CompletionItem(signature, vscode.CompletionItemKind.Function);
        item.detail = '函数签名';
        items.push(item);
      }
    }

    // 添加关键字
    UTS_KEYWORDS.forEach(keyword => {
      const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
      item.detail = 'UTS关键字';
      item.documentation = `UTS语言关键字：${keyword}`;
      items.push(item);
    });

    // 添加类型
    UTS_TYPES.forEach(type => {
      const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
      item.detail = 'UTS类型';
      item.documentation = TYPE_DESCRIPTIONS[type as keyof typeof TYPE_DESCRIPTIONS] || 'UTS语言支持的数据类型';
      items.push(item);
    });

    // 添加控制关键字
    UTS_CONTROL_KEYWORDS.forEach(keyword => {
      const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
      item.detail = 'UTS控制关键字';
      item.documentation = `控制流关键字：${keyword}`;
      items.push(item);
    });

    // 添加内置函数
    UTS_BUILTIN_FUNCTIONS.forEach(func => {
      const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
      item.detail = 'UTS内置函数';
      const signature = FUNCTION_SIGNATURES[func as keyof typeof FUNCTION_SIGNATURES];
      item.documentation = signature || 'UTS语言提供的内置功能';
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
      { label: 'await', insertText: 'const ${1:result} = await ${2:promise};', detail: 'await语句' },
      { label: 'generic', insertText: 'function ${1:functionName}<T>(${2:params}): ${3:Array<T>} {\n\t${4:// function body}\n}', detail: '泛型函数' }
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
  constructor(private languageServer?: UTSLanguageServer) {}
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // 如果语言服务器可用，使用它获取类型信息
    if (this.languageServer) {
      const typeInfo = this.languageServer.getTypeInfo(document, position);
      if (typeInfo) {
        return new vscode.Hover([
          `**类型信息**`,
          `\`\`\`uts\n${typeInfo}\n\`\`\``
        ]);
      }
    }

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
        const signature = FUNCTION_SIGNATURES[`${objectName}.${memberName}` as keyof typeof FUNCTION_SIGNATURES];
        if (signature) {
          return new vscode.Hover([
            `**${objectName}.${memberName}** - 对象成员`,
            `\`\`\`uts\n${signature}\n\`\`\``
          ]);
        }
        return new vscode.Hover([
          `**${objectName}.${memberName}** - 对象成员`,
          `${objectName} 对象的 ${memberName} 方法或属性`
        ]);
      }

      // 检查是否为类实例方法
      const classMethods = CLASS_METHODS[objectName as keyof typeof CLASS_METHODS];
      if (classMethods && classMethods[memberName as keyof typeof classMethods]) {
        const signature = classMethods[memberName as keyof typeof classMethods];
        return new vscode.Hover([
          `**${objectName}.${memberName}** - 类方法`,
          `\`\`\`uts\n${signature}\n\`\`\``
        ]);
      }

      // 动态检测类定义中的方法
      const text = document.getText();
      const lines = text.split('\n');
      
      // 查找类定义
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const classMatch = line.match(new RegExp(`class\\s+${objectName}\\s*`));
        if (classMatch) {
          // 在类定义中查找方法
          for (let j = i + 1; j < lines.length; j++) {
            const methodLine = lines[j];
            // 检查是否到达类结束
            if (methodLine.trim() === '}') break;
            
            // 查找方法定义
            const methodMatch = methodLine.match(new RegExp(`${memberName}\\s*\\([^)]*\\)\\s*:\\s*([^{]+)`));
            if (methodMatch) {
              const returnType = methodMatch[1].trim();
              return new vscode.Hover([
                `**${objectName}.${memberName}** - 类方法`,
                `\`\`\`uts\n${memberName}(): ${returnType}\n\`\`\``,
                `定义位置：第 ${j + 1} 行`
              ]);
            }
          }
          break;
        }
      }
    }

    // 检查是否为函数调用
    const functionCallMatch = beforeCursor.match(/(\w+)\(/);
    if (functionCallMatch) {
      const functionName = functionCallMatch[1];
      const signature = FUNCTION_SIGNATURES[functionName as keyof typeof FUNCTION_SIGNATURES];
      if (signature) {
        return new vscode.Hover([
          `**${functionName}** - 内置函数`,
          `\`\`\`uts\n${signature}\n\`\`\``
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
      const description = TYPE_DESCRIPTIONS[word as keyof typeof TYPE_DESCRIPTIONS];
      return new vscode.Hover([
        `**${word}** - UTS类型`,
        description || 'UTS语言支持的数据类型'
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
      const signature = FUNCTION_SIGNATURES[word as keyof typeof FUNCTION_SIGNATURES];
      if (signature) {
        return new vscode.Hover([
          `**${word}** - UTS内置函数`,
          `\`\`\`uts\n${signature}\n\`\`\``
        ]);
      }
      return new vscode.Hover([
        `**${word}** - UTS内置函数`,
        `UTS语言提供的内置功能`
      ]);
    }

    // 查找文档中的定义
    const text = document.getText();
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 查找函数定义
      const functionMatch = line.match(new RegExp(`function\\s+${word}\\s*\\(([^)]*)\\)\\s*:\\s*([^{]+)`));
      if (functionMatch) {
        const params = functionMatch[1];
        const returnType = functionMatch[2].trim();
        return new vscode.Hover([
          `**${word}** - 函数定义`,
          `\`\`\`uts\nfunction ${word}(${params}): ${returnType}\n\`\`\``,
          `定义位置：第 ${i + 1} 行`
        ]);
      }

      // 查找泛型函数定义
      const genericFunctionMatch = line.match(new RegExp(`function\\s+${word}\\s*<([^>]+)>\\s*\\(([^)]*)\\)\\s*:\\s*([^{]+)`));
      if (genericFunctionMatch) {
        const genericType = genericFunctionMatch[1];
        const params = genericFunctionMatch[2];
        const returnType = genericFunctionMatch[3].trim();
        return new vscode.Hover([
          `**${word}** - 泛型函数定义`,
          `\`\`\`uts\nfunction ${word}<${genericType}>(${params}): ${returnType}\n\`\`\``,
          `定义位置：第 ${i + 1} 行`
        ]);
      }
      
      // 查找类定义
      const classMatch = line.match(new RegExp(`class\\s+${word}\\s*`));
      if (classMatch) {
        return new vscode.Hover([
          `**${word}** - 类定义`,
          `\`\`\`uts\nclass ${word}\n\`\`\``,
          `定义位置：第 ${i + 1} 行`
        ]);
      }
      
      // 查找接口定义
      const interfaceMatch = line.match(new RegExp(`interface\\s+${word}\\s*`));
      if (interfaceMatch) {
        return new vscode.Hover([
          `**${word}** - 接口定义`,
          `\`\`\`uts\ninterface ${word}\n\`\`\``,
          `定义位置：第 ${i + 1} 行`
        ]);
      }
      
      // 查找变量定义
      const varMatch = line.match(new RegExp(`(let|const|var)\\s+${word}\\s*:\\s*([^=;]+)`));
      if (varMatch) {
        const declarationType = varMatch[1];
        const type = varMatch[2].trim();
        return new vscode.Hover([
          `**${word}** - ${declarationType === 'const' ? '常量' : '变量'}定义`,
          `\`\`\`uts\n${declarationType} ${word}: ${type}\n\`\`\``,
          `定义位置：第 ${i + 1} 行`
        ]);
      }

      // 查找变量赋值（类型推断）
      const assignmentMatch = line.match(new RegExp(`(let|const|var)\\s+${word}\\s*=\\s*([^;]+)`));
      if (assignmentMatch) {
        const declarationType = assignmentMatch[1];
        const value = assignmentMatch[2].trim();
        
        // 简单的类型推断
        let inferredType = 'any';
        if (value.includes('"') || value.includes("'")) {
          inferredType = 'string';
        } else if (value.match(/^\d+$/)) {
          inferredType = 'number';
        } else if (value === 'true' || value === 'false') {
          inferredType = 'boolean';
        } else if (value.includes('[') && value.includes(']')) {
          inferredType = 'Array<any>';
        } else if (value.includes('{') && value.includes('}')) {
          inferredType = 'UTSJSONObject';
        } else if (value.includes('new ')) {
          // 提取构造函数名称
          const constructorMatch = value.match(/new\s+(\w+)/);
          if (constructorMatch) {
            inferredType = constructorMatch[1];
          }
        } else if (value.includes('(') && value.includes(')')) {
          // 函数调用，需要查找函数返回类型
          const functionNameMatch = value.match(/(\w+)\s*\(/);
          if (functionNameMatch) {
            const functionName = functionNameMatch[1];
            // 查找函数定义
            for (let j = 0; j < lines.length; j++) {
              const funcLine = lines[j];
              const funcMatch = funcLine.match(new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)\\s*:\\s*([^{]+)`));
              if (funcMatch) {
                inferredType = funcMatch[1].trim();
                break;
              }
            }
          }
        }

        return new vscode.Hover([
          `**${word}** - ${declarationType === 'const' ? '常量' : '变量'}（类型推断）`,
          `\`\`\`uts\n${declarationType} ${word}: ${inferredType} = ${value}\n\`\`\``,
          `定义位置：第 ${i + 1} 行`
        ]);
      }
    }

    return null;
  }
}

// 定义提供者
class UTSDefinitionProvider implements vscode.DefinitionProvider {
  constructor(private languageServer?: UTSLanguageServer) {}
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

      // 查找泛型函数定义
      const genericFunctionMatch = line.match(new RegExp(`function\\s+${word}\\s*<`));
      if (genericFunctionMatch) {
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
      const varMatch = line.match(new RegExp(`(let|const|var)\\s+${word}\\s*[:=]`));
      if (varMatch) {
        return new vscode.Location(document.uri, new vscode.Position(i, line.indexOf(varMatch[1])));
      }
    }
    
    return null;
  }
}

// 文档符号提供者
class UTSDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  constructor(private languageServer?: UTSLanguageServer) {}
  provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
    // 如果语言服务器可用，使用它获取符号
    if (this.languageServer) {
      return this.languageServer.getSymbols(document);
    }

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

      // 匹配泛型函数定义
      const genericFunctionMatch = trimmedLine.match(/function\s+(\w+)\s*</);
      if (genericFunctionMatch) {
        const symbol = new vscode.DocumentSymbol(
          genericFunctionMatch[1],
          '泛型函数',
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
    const line = document.lineAt(position.line).text;
    const beforeCursor = line.substring(0, position.character);
    
    // 查找函数调用
    const functionCallMatch = beforeCursor.match(/(\w+)\(/);
    if (functionCallMatch) {
      const functionName = functionCallMatch[1];
      const signature = FUNCTION_SIGNATURES[functionName as keyof typeof FUNCTION_SIGNATURES];
      
      if (signature) {
        const signatureHelp = new vscode.SignatureHelp();
        const signatureInfo = new vscode.SignatureInformation(signature, 'UTS内置函数');
        signatureHelp.signatures = [signatureInfo];
        signatureHelp.activeSignature = 0;
        signatureHelp.activeParameter = 0;
        return signatureHelp;
      }
    }
    
    return null;
  }
}

export function deactivate() {
  console.log('UTS语言支持插件已停用');
} 