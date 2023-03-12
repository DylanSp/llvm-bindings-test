; ModuleID = 'example'
source_filename = "example"

declare i32 @putchar(i32)

define i32 @myAdd(i32 %0, i32 %1) {
entry:
  %2 = add i32 %0, %1
  ret i32 %2
}

define i32 @main() {
entry:
  %addResult = call i32 @myAdd(i32 97, i32 1)
  %callresult = call i32 @putchar(i32 %addResult)
  ret i32 0
}

