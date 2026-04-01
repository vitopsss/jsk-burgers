import os
import sys

try:
    from PIL import Image, ImageDraw
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw

def process_img(img_path):
    # Open and convert to RGBA
    img = Image.open(img_path).convert("RGBA")
    
    # Create a mask for flood fill. We fill from top-left.
    # To be safe, we replace near-white with pure magenta first
    # So we can just turn magenta into transparent
    
    width, height = img.size
    
    # We will use floodfill on a temporary RGB image
    temp = img.convert("RGB")
    ImageDraw.floodfill(temp, (0, 0), (255, 0, 255), thresh=40)
    ImageDraw.floodfill(temp, (width-1, 0), (255, 0, 255), thresh=40)
    ImageDraw.floodfill(temp, (0, height-1), (255, 0, 255), thresh=40)
    ImageDraw.floodfill(temp, (width-1, height-1), (255, 0, 255), thresh=40)
    
    # Now merge back
    temp_data = temp.getdata()
    img_data = img.getdata()
    
    new_data = []
    for i in range(len(temp_data)):
        if temp_data[i] == (255, 0, 255):
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(img_data[i])
            
    img.putdata(new_data)
    new_path = img_path.replace('.jpg', '.png')
    img.save(new_path, "PNG")

dir_path = r"c:\jsk\hamburguerjsk"
print("Processing images...")
for f in os.listdir(dir_path):
    if f.endswith(".jpg"):
        process_img(os.path.join(dir_path, f))
        print(f"Processed {f}")
print("Done!")
