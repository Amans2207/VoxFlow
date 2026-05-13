import sys
print("Starting...")

try:
    print("Importing faster_whisper...")
    from faster_whisper import WhisperModel
    print("Success whisper.")
except Exception as e:
    print("Error whisper:", e)

try:
    print("Importing f5_tts...")
    from f5_tts.infer.utils_infer import load_model
    print("Success f5_tts.")
except Exception as e:
    print("Error f5_tts:", e)

print("Done.")
