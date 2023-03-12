; ModuleID = '<stdin>'
source_filename = "example"

; Function Attrs: nofree nounwind
declare noundef i32 @putchar(i32 noundef) local_unnamed_addr #0

; Function Attrs: mustprogress nofree norecurse nosync nounwind readnone willreturn
define i32 @myAdd(i32 %0, i32 %1) local_unnamed_addr #1 {
entry:
  %2 = add i32 %1, %0
  ret i32 %2
}

; Function Attrs: nofree nounwind
define i32 @main() local_unnamed_addr #0 {
entry:
  %callresult = tail call i32 @putchar(i32 98)
  ret i32 0
}

attributes #0 = { nofree nounwind }
attributes #1 = { mustprogress nofree norecurse nosync nounwind readnone willreturn }
