# llvm-bindings test project

Testing that the [llvm-bindings](https://github.com/ApsarasX/llvm-bindings) library works well for calling LLVM 14.

## Running

1. Run the Typescript code with `npx ts-node src/main.ts > example.ll`, which will output textual LLVM IR.
1. (optional) Run the LLVM optimizer with `opt -S -O3 < example.ll > optimized.ll`; this will show the constant folding optimization, eliminating the runtime addition of 97+1.
1. Run `llc < example.ll > example.s` to use LLVM to compile to assembly.
1. Run `gcc example.s -o example` to compile and link the assembly to an executable.
1. Run the executable with `./example`. It should print the character `b` to the console.

## References

- https://github.com/ApsarasX/llvm-bindings
- https://github.com/dfellis/llvm-hello-world
- https://man7.org/linux/man-pages/man3/puts.3.html
