import llvm from "llvm-bindings";

function generateFullProgram() {
  const context = new llvm.LLVMContext();
  const module = new llvm.Module("example", context);
  const builder = new llvm.IRBuilder(context);

  // from libc:
  // int putchar(int c);
  function generatePutCharExternalDeclaration() {
    const returnType = builder.getInt32Ty();
    const paramTypes = [builder.getInt32Ty()];
    const functionType = llvm.FunctionType.get(returnType, paramTypes, false);

    // write the function declaration into our module by including `module` as the last argument
    llvm.Function.Create(functionType, llvm.Function.LinkageTypes.ExternalLinkage, "putchar", module);
  }

  // generate the definition for a function that adds two i32's and returns an i32
  function generateAddDefinition(): llvm.Function {
    const returnType = builder.getInt32Ty();
    const paramTypes = [builder.getInt32Ty(), builder.getInt32Ty()];
    const functionType = llvm.FunctionType.get(returnType, paramTypes, false);

    const addFunction = llvm.Function.Create(
      functionType,
      // llvm.Function.LinkageTypes.PrivateLinkage,
      llvm.Function.LinkageTypes.ExternalLinkage,
      "myAdd",
      module,
    );

    // generate function definition
    const entryBasicBlock = llvm.BasicBlock.Create(context, "entry", addFunction);
    builder.SetInsertPoint(entryBasicBlock);

    const a = addFunction.getArg(0);
    const b = addFunction.getArg(1);
    const result = builder.CreateAdd(a, b);

    builder.CreateRet(result);

    return addFunction;
  }

  function generateMainDefinition(addFunction: llvm.Function) {
    // set up the "main" function
    const returnType = builder.getInt32Ty();
    const functionType = llvm.FunctionType.get(returnType, false);

    // writes the function declaration (body is currently empty)
    const mainFunction = llvm.Function.Create(
      functionType,
      llvm.Function.LinkageTypes.ExternalLinkage, // needs to be ExternalLinkage so the linker can pick up on this
      "main",
      module,
    );

    // start writing the function definition;
    // set up a basic block in the body of "main", then start writing into it
    const entryBasicBlock = llvm.BasicBlock.Create(context, "entry", mainFunction);
    builder.SetInsertPoint(entryBasicBlock);

    // declarare an LLVM value for the constant 97 (ASCII for 'a'); LLVM type is i32
    const aChar = llvm.ConstantInt.get(context, new llvm.APInt(32, 97));

    // declare an LLVM value for the constant 1; LLVM type is i32
    const oneConstant = llvm.ConstantInt.get(context, new llvm.APInt(32, 1));

    // call myAdd(aChar, oneConstant), should return 98 (ASCII for 'b')
    const addCallResult = builder.CreateCall(addFunction, [aChar, oneConstant], "addResult");

    // insert instructions for calling putchar function with addResult as the argument
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const putcharFunction = module.getFunction("putchar")!;
    builder.CreateCall(putcharFunction, [addCallResult], "callresult");

    // generate a "ret" instruction that returns from main with 0
    const constantZero = llvm.ConstantInt.get(context, new llvm.APInt(32, 0));
    builder.CreateRet(constantZero);
  }

  generatePutCharExternalDeclaration();
  const addFunction = generateAddDefinition();
  generateMainDefinition(addFunction);

  if (llvm.verifyModule(module)) {
    console.error("Verifying module failed");
    return;
  }
  console.log(module.print());
}

generateFullProgram();
