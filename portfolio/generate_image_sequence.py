#!/usr/bin/env python3
"""
Image Rotation Generator for Portfolio Website
Generates 25 rotated images from a single portrait photo (0°, 15°, 30° ... 360°)
Requires: pip install Pillow

Usage:
    python generate_images.py input_photo.jpg output_directory/
"""

import os
import sys
from PIL import Image

def generate_rotations(input_path, output_dir, angles=None, quality=95, output_format='webp'):
    """
    Generate rotated image sequence.
    
    Args:
        input_path (str): Path to input image
        output_dir (str): Directory to save rotated images
        angles (list): List of angles (default: 0, 15, 30, ..., 360)
        quality (int): Output quality (1-100)
        output_format (str): Output format (webp, jpg, png)
    """
    
    # Default angles
    if angles is None:
        angles = list(range(0, 361, 15))
    
    # Validate input
    if not os.path.exists(input_path):
        print(f"❌ Error: Input file not found: {input_path}")
        return False
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Load image
        img = Image.open(input_path)
        print(f"✅ Loaded image: {input_path}")
        print(f"   Size: {img.size[0]}x{img.size[1]} px")
        print(f"   Mode: {img.mode}")
        
        # Convert RGBA to RGB if needed (for JPEG/WEBP)
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
            print(f"   Converted to RGB")
        
        # Generate rotations
        print(f"\n🔄 Generating {len(angles)} rotated images...")
        
        for angle in angles:
            # Rotate image
            # expand=False keeps original size, expand=True allows larger canvas
            rotated = img.rotate(angle, expand=False, resample=Image.Resampling.BICUBIC)
            
            # Save with proper naming
            filename = f"image_{angle:03d}.{output_format}"
            filepath = os.path.join(output_dir, filename)
            
            if output_format.lower() == 'webp':
                rotated.save(filepath, 'WEBP', quality=quality, method=6)
            elif output_format.lower() == 'jpg':
                rotated.save(filepath, 'JPEG', quality=quality)
            else:  # PNG
                rotated.save(filepath, 'PNG', optimize=True)
            
            print(f"   ✓ {filename} ({angle}°)")
        
        print(f"\n✅ Success! Generated {len(angles)} images in: {output_dir}")
        
        # Calculate total file size
        total_size = sum(
            os.path.getsize(os.path.join(output_dir, f"image_{angle:03d}.{output_format}"))
            for angle in angles
        )
        print(f"   Total size: {total_size / 1024 / 1024:.2f} MB")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def optimize_images(output_dir, output_format='webp'):
    """Optimize images for web (requires cwebp for WebP)."""
    if output_format.lower() != 'webp':
        return
    
    try:
        import subprocess
        print("\n🔧 Attempting to further optimize WebP images...")
        
        for filename in sorted(os.listdir(output_dir)):
            if filename.endswith('.webp'):
                filepath = os.path.join(output_dir, filename)
                # Use cwebp for additional compression
                subprocess.run([
                    'cwebp', '-q', '85', '-m', '6',
                    filepath, '-o', filepath
                ], check=True, capture_output=True)
        
        print("   ✓ Optimization complete")
    except Exception as e:
        print(f"   Note: cwebp not available for further optimization ({e})")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python generate_images.py <input_photo> [output_directory] [--format webp/jpg/png]")
        print("\nExample:")
        print("  python generate_images.py portrait.jpg ./public/portfolio-images/")
        print("  python generate_images.py portrait.jpg ./output --format jpg")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else './portfolio-images'
    
    # Parse format flag
    output_format = 'webp'
    for arg in sys.argv[3:]:
        if arg.startswith('--format'):
            output_format = arg.split('=')[-1].lower()
    
    # Generate
    success = generate_rotations(input_file, output_dir, output_format=output_format)
    
    # Optimize
    if success and output_format == 'webp':
        optimize_images(output_dir, output_format)
    
    sys.exit(0 if success else 1)
