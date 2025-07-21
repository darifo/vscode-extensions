import * as vscode from 'vscode';
import * as ts from 'typescript';

// UTS语言服务器类
export class UTSLanguageServer {
  private readonly diagnosticCollection: vscode.DiagnosticCollection;
  private readonly workspaceRoot: string;
  private readonly compilerOptions: ts.CompilerOptions;

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('uts');
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    
    // 配置TypeScript编译器选项，支持完整的TypeScript语法
    this.compilerOptions = {
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      allowSyntheticDefaultImports: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      allowJs: true,
      checkJs: false,
      noImplicitAny: false,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedIndexedAccess: true,
      exactOptionalPropertyTypes: true,
      noImplicitOverride: true,
      noPropertyAccessFromIndexSignature: true,
      useUnknownInCatchVariables: true,
      allowUnreachableCode: false,
      allowUnusedLabels: false,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictBindCallApply: true,
      strictPropertyInitialization: true,
      noImplicitThis: true,
      alwaysStrict: true
    };
  }

  // 初始化语言服务器
  public initialize(): void {
    // 注册文档变化监听器
    vscode.workspace.onDidChangeTextDocument(this.onDocumentChanged.bind(this));
    vscode.workspace.onDidOpenTextDocument(this.onDocumentOpened.bind(this));
    
    // 处理所有已打开的UTS文档
    vscode.workspace.textDocuments.forEach(doc => {
      if (doc.languageId === 'uts') {
        this.validateDocument(doc);
      }
    });
  }

  // 文档变化处理
  private onDocumentChanged(event: vscode.TextDocumentChangeEvent): void {
    if (event.document.languageId === 'uts') {
      this.validateDocument(event.document);
    }
  }

  // 文档打开处理
  private onDocumentOpened(document: vscode.TextDocument): void {
    if (document.languageId === 'uts') {
      this.validateDocument(document);
    }
  }

  // 验证文档
  private validateDocument(document: vscode.TextDocument): void {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const sourceFile = ts.createSourceFile(
      document.fileName,
      text,
      ts.ScriptTarget.Latest,
      true
    );

    // 使用TypeScript编译器API进行语法检查
    const program = ts.createProgram([document.fileName], this.compilerOptions);
    const typeChecker = program.getTypeChecker();

    // 获取所有诊断信息
    const allDiagnostics = ts.getPreEmitDiagnostics(program);
    
    allDiagnostics.forEach((diagnostic: ts.Diagnostic) => {
      if (diagnostic.file && diagnostic.file.fileName === document.fileName && diagnostic.start !== undefined) {
        const range = this.convertRange(document, { start: diagnostic.start, length: diagnostic.length || 0 });
        const vscodeDiagnostic = new vscode.Diagnostic(
          range,
          diagnostic.messageText.toString(),
          this.convertDiagnosticCategory(diagnostic.category)
        );
        vscodeDiagnostic.source = 'UTS Language Server';
        diagnostics.push(vscodeDiagnostic);
      }
    });

    // 添加UTS特定的语法检查
    this.addUTSSpecificDiagnostics(document, diagnostics);

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  // 添加UTS特定的诊断
  private addUTSSpecificDiagnostics(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): void {
    const text = document.getText();
    const lines = text.split('\n');

    lines.forEach((line, lineIndex) => {
      // 检查UTS特定的语法规则
      this.checkUTSSyntax(line, lineIndex, diagnostics);
    });
  }

  // 检查UTS语法
  private checkUTSSyntax(line: string, lineIndex: number, diagnostics: vscode.Diagnostic[]): void {
    // 检查UTS关键字使用
    const utsKeywords = ['UTSJSONObject', 'UTSJSONValue', 'UTSArray', 'UTSString', 'UTSNumber', 'UTSBoolean'];
    
    utsKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      let match;
      while ((match = regex.exec(line)) !== null) {
        const range = new vscode.Range(
          new vscode.Position(lineIndex, match.index),
          new vscode.Position(lineIndex, match.index + keyword.length)
        );
        
        const diagnostic = new vscode.Diagnostic(
          range,
          `UTS类型: ${keyword}`,
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = 'UTS Language Server';
        diagnostics.push(diagnostic);
      }
    });

    // 检查装饰器使用
    const decoratorRegex = /@(\w+)/g;
    let decoratorMatch;
    while ((decoratorMatch = decoratorRegex.exec(line)) !== null) {
      const range = new vscode.Range(
        new vscode.Position(lineIndex, decoratorMatch.index),
        new vscode.Position(lineIndex, decoratorMatch.index + decoratorMatch[0].length)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `装饰器: ${decoratorMatch[1]}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }

    // 检查泛型使用
    const genericRegex = /<([^>]+)>/g;
    let genericMatch;
    while ((genericMatch = genericRegex.exec(line)) !== null) {
      const range = new vscode.Range(
        new vscode.Position(lineIndex, genericMatch.index),
        new vscode.Position(lineIndex, genericMatch.index + genericMatch[0].length)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `泛型参数: ${genericMatch[1]}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }

    // 检查类定义
    const classMatch = line.match(/class\s+(\w+)/);
    if (classMatch) {
      const className = classMatch[1];
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('class')),
        new vscode.Position(lineIndex, line.indexOf('class') + 5)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `UTS类定义: ${className}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }

    // 检查函数定义
    const functionMatch = line.match(/function\s+(\w+)/);
    if (functionMatch) {
      const functionName = functionMatch[1];
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('function')),
        new vscode.Position(lineIndex, line.indexOf('function') + 8)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `UTS函数定义: ${functionName}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }

    // 检查接口定义
    const interfaceMatch = line.match(/interface\s+(\w+)/);
    if (interfaceMatch) {
      const interfaceName = interfaceMatch[1];
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('interface')),
        new vscode.Position(lineIndex, line.indexOf('interface') + 9)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `UTS接口定义: ${interfaceName}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }

    // 检查类型别名定义
    const typeMatch = line.match(/type\s+(\w+)/);
    if (typeMatch) {
      const typeName = typeMatch[1];
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('type')),
        new vscode.Position(lineIndex, line.indexOf('type') + 4)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `UTS类型别名: ${typeName}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }

    // 检查枚举定义
    const enumMatch = line.match(/enum\s+(\w+)/);
    if (enumMatch) {
      const enumName = enumMatch[1];
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('enum')),
        new vscode.Position(lineIndex, line.indexOf('enum') + 4)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `UTS枚举定义: ${enumName}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }

    // 检查命名空间定义
    const namespaceMatch = line.match(/namespace\s+(\w+)/);
    if (namespaceMatch) {
      const namespaceName = namespaceMatch[1];
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('namespace')),
        new vscode.Position(lineIndex, line.indexOf('namespace') + 9)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `UTS命名空间: ${namespaceName}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }

    // 检查模块定义
    const moduleMatch = line.match(/module\s+(\w+)/);
    if (moduleMatch) {
      const moduleName = moduleMatch[1];
      const range = new vscode.Range(
        new vscode.Position(lineIndex, line.indexOf('module')),
        new vscode.Position(lineIndex, line.indexOf('module') + 6)
      );
      
      const diagnostic = new vscode.Diagnostic(
        range,
        `UTS模块: ${moduleName}`,
        vscode.DiagnosticSeverity.Information
      );
      diagnostic.source = 'UTS Language Server';
      diagnostics.push(diagnostic);
    }
  }

  // 转换TypeScript范围到VSCode范围
  private convertRange(document: vscode.TextDocument, span: ts.TextSpan): vscode.Range {
    const start = document.positionAt(span.start);
    const end = document.positionAt(span.start + span.length);
    return new vscode.Range(start, end);
  }

  // 转换诊断类别
  private convertDiagnosticCategory(category: ts.DiagnosticCategory): vscode.DiagnosticSeverity {
    switch (category) {
      case ts.DiagnosticCategory.Error:
        return vscode.DiagnosticSeverity.Error;
      case ts.DiagnosticCategory.Warning:
        return vscode.DiagnosticSeverity.Warning;
      case ts.DiagnosticCategory.Suggestion:
        return vscode.DiagnosticSeverity.Information;
      case ts.DiagnosticCategory.Message:
        return vscode.DiagnosticSeverity.Information;
      default:
        return vscode.DiagnosticSeverity.Information;
    }
  }

  // 获取符号信息
  public getSymbols(document: vscode.TextDocument): vscode.SymbolInformation[] {
    const symbols: vscode.SymbolInformation[] = [];
    const text = document.getText();
    const sourceFile = ts.createSourceFile(
      document.fileName,
      text,
      ts.ScriptTarget.Latest,
      true
    );

    // 使用TypeScript编译器API获取符号
    const program = ts.createProgram([document.fileName], this.compilerOptions);
    const typeChecker = program.getTypeChecker();
    
    // 遍历AST获取符号
    const visitNode = (node: ts.Node) => {
      if (ts.isClassDeclaration(node) && node.name) {
        const symbol = new vscode.SymbolInformation(
          node.name.text,
          vscode.SymbolKind.Class,
          '',
          new vscode.Location(
            document.uri,
            this.convertRange(document, { start: node.getStart(), length: node.getWidth() })
          )
        );
        symbols.push(symbol);
      } else if (ts.isFunctionDeclaration(node) && node.name) {
        const symbol = new vscode.SymbolInformation(
          node.name.text,
          vscode.SymbolKind.Function,
          '',
          new vscode.Location(
            document.uri,
            this.convertRange(document, { start: node.getStart(), length: node.getWidth() })
          )
        );
        symbols.push(symbol);
      } else if (ts.isVariableStatement(node)) {
        node.declarationList.declarations.forEach(declaration => {
          if (declaration.name && ts.isIdentifier(declaration.name)) {
            const symbol = new vscode.SymbolInformation(
              declaration.name.text,
              vscode.SymbolKind.Variable,
              '',
              new vscode.Location(
                document.uri,
                this.convertRange(document, { start: declaration.getStart(), length: declaration.getWidth() })
              )
            );
            symbols.push(symbol);
          }
        });
      } else if (ts.isInterfaceDeclaration(node)) {
        const symbol = new vscode.SymbolInformation(
          node.name.text,
          vscode.SymbolKind.Interface,
          '',
          new vscode.Location(
            document.uri,
            this.convertRange(document, { start: node.getStart(), length: node.getWidth() })
          )
        );
        symbols.push(symbol);
      } else if (ts.isTypeAliasDeclaration(node)) {
        const symbol = new vscode.SymbolInformation(
          node.name.text,
          vscode.SymbolKind.TypeParameter,
          '',
          new vscode.Location(
            document.uri,
            this.convertRange(document, { start: node.getStart(), length: node.getWidth() })
          )
        );
        symbols.push(symbol);
      } else if (ts.isEnumDeclaration(node)) {
        const symbol = new vscode.SymbolInformation(
          node.name.text,
          vscode.SymbolKind.Enum,
          '',
          new vscode.Location(
            document.uri,
            this.convertRange(document, { start: node.getStart(), length: node.getWidth() })
          )
        );
        symbols.push(symbol);
      } else if (ts.isModuleDeclaration(node) && node.name && ts.isIdentifier(node.name)) {
        const symbol = new vscode.SymbolInformation(
          node.name.text,
          vscode.SymbolKind.Namespace,
          '',
          new vscode.Location(
            document.uri,
            this.convertRange(document, { start: node.getStart(), length: node.getWidth() })
          )
        );
        symbols.push(symbol);
      }

      ts.forEachChild(node, visitNode);
    };

    visitNode(sourceFile);
    return symbols;
  }

  // 获取类型信息
  public getTypeInfo(document: vscode.TextDocument, position: vscode.Position): string | null {
    const text = document.getText();
    const sourceFile = ts.createSourceFile(
      document.fileName,
      text,
      ts.ScriptTarget.Latest,
      true
    );

    const program = ts.createProgram([document.fileName], this.compilerOptions);
    const typeChecker = program.getTypeChecker();
    const offset = document.offsetAt(position);

    // 查找节点
    const findNode = (node: ts.Node): ts.Node | null => {
      if (node.getStart() <= offset && offset <= node.getEnd()) {
        for (const child of node.getChildren()) {
          const found = findNode(child);
          if (found) return found;
        }
        return node;
      }
      return null;
    };

    const node = findNode(sourceFile);
    if (node && ts.isIdentifier(node)) {
      const type = typeChecker.getTypeAtLocation(node);
      return typeChecker.typeToString(type);
    }

    return null;
  }

  // 获取完成项
  public getCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];
    const text = document.getText();
    const sourceFile = ts.createSourceFile(
      document.fileName,
      text,
      ts.ScriptTarget.Latest,
      true
    );

    const program = ts.createProgram([document.fileName], this.compilerOptions);
    const typeChecker = program.getTypeChecker();
    const offset = document.offsetAt(position);

    // 获取上下文信息
    const line = document.lineAt(position.line).text;
    const beforeCursor = line.substring(0, position.character);

    // 检查是否在对象成员访问上下文中
    const dotMatch = beforeCursor.match(/(\w+)\.$/);
    if (dotMatch) {
      const objectName = dotMatch[1];
      return this.getObjectMembers(objectName, document, position);
    }

    // 获取全局符号
    const globalSymbols = typeChecker.getSymbolsInScope(sourceFile, ts.SymbolFlags.Function | ts.SymbolFlags.Class | ts.SymbolFlags.Interface | ts.SymbolFlags.Variable | ts.SymbolFlags.Property | ts.SymbolFlags.Method | ts.SymbolFlags.TypeParameter | ts.SymbolFlags.Enum | ts.SymbolFlags.Namespace | ts.SymbolFlags.Module);
    globalSymbols.forEach(symbol => {
      if (symbol.name && symbol.name !== '__type') {
        const item = new vscode.CompletionItem(symbol.name, this.getCompletionItemKind(symbol));
        item.detail = this.getSymbolDetail(symbol, typeChecker);
        item.documentation = this.getSymbolDocumentation(symbol, typeChecker);
        items.push(item);
      }
    });

    return items;
  }

  // 获取对象成员
  private getObjectMembers(objectName: string, document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];
    const text = document.getText();
    const sourceFile = ts.createSourceFile(
      document.fileName,
      text,
      ts.ScriptTarget.Latest,
      true
    );

    const program = ts.createProgram([document.fileName], this.compilerOptions);

    const typeChecker = program.getTypeChecker();

    // 查找对象类型
    const findObjectType = (node: ts.Node): ts.Type | null => {
      if (ts.isIdentifier(node) && node.text === objectName) {
        return typeChecker.getTypeAtLocation(node);
      }
      for (const child of node.getChildren()) {
        const found = findObjectType(child);
        if (found) return found;
      }
      return null;
    };

    const objectType = findObjectType(sourceFile);
    if (objectType) {
      const properties = typeChecker.getPropertiesOfType(objectType);
      properties.forEach(property => {
        const item = new vscode.CompletionItem(property.name, this.getCompletionItemKind(property));
        item.detail = this.getSymbolDetail(property, typeChecker);
        item.documentation = this.getSymbolDocumentation(property, typeChecker);
        items.push(item);
      });
    }

    return items;
  }

  // 获取完成项类型
  private getCompletionItemKind(symbol: ts.Symbol): vscode.CompletionItemKind {
    const flags = symbol.getFlags();
    if (flags & ts.SymbolFlags.Function) {
      return vscode.CompletionItemKind.Function;
    } else if (flags & ts.SymbolFlags.Class) {
      return vscode.CompletionItemKind.Class;
    } else if (flags & ts.SymbolFlags.Interface) {
      return vscode.CompletionItemKind.Interface;
    } else if (flags & ts.SymbolFlags.Variable) {
      return vscode.CompletionItemKind.Variable;
    } else if (flags & ts.SymbolFlags.Property) {
      return vscode.CompletionItemKind.Property;
    } else if (flags & ts.SymbolFlags.Method) {
      return vscode.CompletionItemKind.Method;
    } else if (flags & ts.SymbolFlags.TypeParameter) {
      return vscode.CompletionItemKind.TypeParameter;
    } else if (flags & ts.SymbolFlags.Enum) {
      return vscode.CompletionItemKind.Enum;
    } else if (flags & ts.SymbolFlags.Namespace) {
      return vscode.CompletionItemKind.Class;
    } else if (flags & ts.SymbolFlags.Module) {
      return vscode.CompletionItemKind.Class;
    } else {
      return vscode.CompletionItemKind.Text;
    }
  }

  // 获取符号详情
  private getSymbolDetail(symbol: ts.Symbol, typeChecker: ts.TypeChecker): string {
    const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
    return typeChecker.typeToString(type);
  }

  // 获取符号文档
  private getSymbolDocumentation(symbol: ts.Symbol, typeChecker: ts.TypeChecker): string {
    const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
    return typeChecker.typeToString(type);
  }

  // 清理资源
  public dispose(): void {
    this.diagnosticCollection.dispose();
  }
} 