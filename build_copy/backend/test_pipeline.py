import traceback
try:
    from pipeline import DubbingPipeline
    print("Initializing pipeline...")
    p = DubbingPipeline(device="cpu")
    print("Success")
except Exception as e:
    print("Error:")
    traceback.print_exc()
