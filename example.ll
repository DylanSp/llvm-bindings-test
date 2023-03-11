; ModuleID = 'example'
source_filename = "example"

declare i32 @putchar(i32)

define i32 @main() {
entry:
  %callresult = call i32 @putchar(i32 97)
  ret i32 0
}

