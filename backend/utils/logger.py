import logging
import sys

def setup_logger():
    """Sets up a clean, color-coded terminal logger for VoxFlow."""
    logger = logging.getLogger("VoxFlow")
    logger.setLevel(logging.INFO)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
        
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        '%(asctime)s | %(levelname)s | %(name)s | %(message)s',
        datefmt='%H:%M:%S'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    return logger

vox_logger = setup_logger()
