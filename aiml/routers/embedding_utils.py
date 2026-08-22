import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io
import warnings

# Suppress warnings from PyTorch
warnings.filterwarnings("ignore", category=UserWarning)

# Load ResNet18 globally
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
try:
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
except Exception:
    # Fallback to older syntax if weights enum isn't available
    model = models.resnet18(pretrained=True)

# Remove the classification head to get the raw 512-dim features
model.fc = torch.nn.Identity()
model.eval()
model.to(device)

# Standard ImageNet transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def get_embedding(image_bytes: bytes):
    """
    Computes a 512-dimensional embedding vector for an image.
    Returns a Python list of floats, or None if the image is invalid.
    """
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        tensor = transform(image).unsqueeze(0).to(device)
        with torch.no_grad():
            features = model(tensor).cpu().numpy()[0]
        return features.tolist()
    except Exception as e:
        print(f"Error computing embedding: {e}")
        return None
