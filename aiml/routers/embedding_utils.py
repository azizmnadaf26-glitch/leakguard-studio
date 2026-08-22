import io
from PIL import Image

def get_embedding(image_bytes: bytes):
    """
    Computes a 512-dimensional embedding vector for an image without using PyTorch
    (which exceeds the 512MB RAM limit on free Render instances).
    
    Instead, it uses a deterministic spatial pixel embedding (resizing the image 
    to 16x32, converting to grayscale, and normalizing the pixels).
    This works perfectly for finding exact duplicates or highly similar crops
    for hackathon demonstrations!
    """
    try:
        # Open image and convert to grayscale
        image = Image.open(io.BytesIO(image_bytes)).convert('L')
        
        # Resize to 16x32 = 512 pixels
        image = image.resize((16, 32), Image.Resampling.LANCZOS)
        
        # Get pixel values (0 to 255)
        pixels = list(image.getdata())
        
        # Normalize to 0.0 - 1.0
        normalized = [float(p) / 255.0 for p in pixels]
        
        return normalized
    except Exception as e:
        print(f"Error computing embedding: {e}")
        return None
