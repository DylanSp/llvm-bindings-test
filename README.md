# llvm-bindings test project

Testing that the [llvm-bindings](https://github.com/ApsarasX/llvm-bindings) library works well.

## Running

1. Run the Typescript code with `npx ts-node src/main.ts > example.ll`, which will output textual LLVM IR.
1. Run `llc < example.ll > example.s` to use LLVM to compile to assembly.
1. Run `gcc example.s -o example` to compile and link the assembly to an executable.
1. Run the executable with `./example`.
