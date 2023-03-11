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

  function generateMainDefinition() {
    // set up the "main" function
    const mainReturnType = builder.getInt32Ty();
    const mainFunctionType = llvm.FunctionType.get(mainReturnType, false);
    const mainFunction = llvm.Function.Create(
      mainFunctionType,
      llvm.Function.LinkageTypes.ExternalLinkage, // needs to be ExternalLinkage so the linker can pick up on this
      "main",
      module,
    );

    // set up a basic block in the body of "main"
    const entryBasicBlock = llvm.BasicBlock.Create(context, "entry", mainFunction);
    builder.SetInsertPoint(entryBasicBlock);

    // declarare an LLVM value for the constant 97 (ASCII for 'a'); LLVM type is i32
    const aChar = llvm.ConstantInt.get(context, new llvm.APInt(32, 97));

    // insert instructions for calling putchar function with aChar as the argument
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const putcharFunction = module.getFunction("putchar")!;
    builder.CreateCall(putcharFunction, [aChar], "callresult");

    // generate a "ret" instruction that returns from main with 0
    const constantZero = llvm.ConstantInt.get(context, new llvm.APInt(32, 0));
    builder.CreateRet(constantZero);
  }

  generatePutCharExternalDeclaration();
  generateMainDefinition();

  if (llvm.verifyModule(module)) {
    console.error("Verifying module failed");
    return;
  }
  console.log(module.print());
}

generateFullProgram();
