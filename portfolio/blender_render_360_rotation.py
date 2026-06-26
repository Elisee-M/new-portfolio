#!/usr/bin/env blender --python
"""
Blender Script: Professional 360° Portrait Rotation Image Sequence Generator
For generating high-quality rotated head images for portfolio website

Usage in Blender:
    1. Open your project with 3D head model
    2. Scripting tab → New text → Paste this script
    3. Configure settings below
    4. Run script
    5. Check output folder for rendered images

Requirements:
    - Blender 3.0+
    - 3D head model or photo as plane
    - Camera positioned facing the head
    - Lighting setup complete
"""

import bpy
import os
from pathlib import Path

# ============================================================================
# CONFIGURATION
# ============================================================================

# Output Settings
OUTPUT_DIR = "/path/to/portfolio-images"  # Change this to your output directory
IMAGE_FORMAT = 'WEBP'  # 'PNG', 'JPEG', or 'WEBP'
QUALITY = 95  # For JPEG/WEBP: 0-100
IMAGE_RESOLUTION = (1024, 1024)  # Width x Height in pixels

# Rotation Settings
ROTATION_ANGLES = [i * 15 for i in range(25)]  # 0°, 15°, 30°, ..., 360°
ROTATION_AXIS = 'Z'  # 'X', 'Y', or 'Z' (typically 'Z' for vertical head rotation)
ROTATION_AROUND_CENTER = True  # Rotate around world origin

# Head Model Settings
HEAD_OBJECT_NAME = "Head"  # Name of your 3D head model in outliner
CAMERA_NAME = "Camera"     # Name of your camera object

# Render Settings
RENDER_ENGINE = 'CYCLES'  # 'CYCLES' or 'EEVEE'
SAMPLES = 128  # For CYCLES: higher = better quality, slower
USE_GPU = True  # Use GPU rendering if available

# ============================================================================
# SCRIPT STARTS HERE
# ============================================================================

def setup_render_settings():
    """Configure render engine and quality settings."""
    scene = bpy.context.scene
    
    # Set render engine
    if RENDER_ENGINE == 'CYCLES':
        scene.render.engine = 'CYCLES'
        scene.cycles.samples = SAMPLES
        if USE_GPU:
            scene.cycles.device = 'GPU'
            # Enable CUDA/OptiX in preferences if available
    else:
        scene.render.engine = 'EEVEE'
    
    # Set output format
    scene.render.image_settings.file_format = IMAGE_FORMAT
    if IMAGE_FORMAT in ('JPEG', 'WEBP'):
        scene.render.image_settings.quality = QUALITY
    
    # Set resolution
    scene.render.resolution_x = IMAGE_RESOLUTION[0]
    scene.render.resolution_y = IMAGE_RESOLUTION[1]
    scene.render.resolution_percentage = 100
    
    # Performance settings
    scene.render.tile_x = 256
    scene.render.tile_y = 256
    scene.render.use_denoising = True
    
    print(f"✅ Render settings configured")
    print(f"   Engine: {RENDER_ENGINE}")
    print(f"   Resolution: {IMAGE_RESOLUTION[0]}x{IMAGE_RESOLUTION[1]}")
    print(f"   Format: {IMAGE_FORMAT}")


def validate_setup():
    """Check that required objects exist."""
    scene = bpy.context.scene
    
    # Check for head object
    head = bpy.data.objects.get(HEAD_OBJECT_NAME)
    if not head:
        print(f"⚠️  Warning: Head object '{HEAD_OBJECT_NAME}' not found")
        print(f"   Available objects: {[obj.name for obj in bpy.data.objects]}")
        return False
    
    # Check for camera
    camera = bpy.data.objects.get(CAMERA_NAME)
    if not camera or camera.type != 'CAMERA':
        print(f"⚠️  Warning: Camera '{CAMERA_NAME}' not found")
        print(f"   Setting active camera to scene default")
        if scene.camera is None:
            print(f"⚠️  No camera in scene! Create one first.")
            return False
    else:
        scene.camera = camera
    
    print(f"✅ Setup validated")
    return True


def create_output_directory():
    """Create output directory if it doesn't exist."""
    output_path = Path(OUTPUT_DIR)
    output_path.mkdir(parents=True, exist_ok=True)
    print(f"✅ Output directory ready: {OUTPUT_DIR}")
    return str(output_path)


def render_rotation_sequence():
    """Main rendering loop."""
    scene = bpy.context.scene
    head = bpy.data.objects.get(HEAD_OBJECT_NAME)
    
    if not head:
        print("❌ Head object not found!")
        return False
    
    # Store original rotation
    original_rotation = head.rotation_euler.copy()
    original_location = head.location.copy() if ROTATION_AROUND_CENTER else None
    
    # Get axis index
    axis_map = {'X': 0, 'Y': 1, 'Z': 2}
    axis_idx = axis_map[ROTATION_AXIS]
    
    output_path = Path(OUTPUT_DIR)
    total_angles = len(ROTATION_ANGLES)
    
    print(f"\n🔄 Starting render sequence ({total_angles} images)...")
    print(f"   Rotating around {ROTATION_AXIS} axis")
    
    for index, angle in enumerate(ROTATION_ANGLES):
        try:
            # Set rotation
            rotation = list(original_rotation)
            rotation[axis_idx] = angle * (3.14159 / 180)  # Convert to radians
            head.rotation_euler = rotation
            
            # Update scene
            bpy.context.view_layer.update()
            
            # Set output filename
            output_filename = f"image_{angle:03d}.{IMAGE_FORMAT.lower()}"
            output_file = str(output_path / output_filename)
            scene.render.filepath = output_file
            
            # Render
            print(f"   [{index+1}/{total_angles}] Rendering {output_filename}...", end=" ", flush=True)
            bpy.ops.render.render(write_still=True)
            print("✓")
            
        except Exception as e:
            print(f"\n❌ Error rendering {angle}°: {str(e)}")
            return False
    
    # Restore original rotation
    head.rotation_euler = original_rotation
    
    print(f"\n✅ Rendering complete!")
    
    # Calculate file sizes
    total_size = 0
    for angle in ROTATION_ANGLES:
        filepath = output_path / f"image_{angle:03d}.{IMAGE_FORMAT.lower()}"
        if filepath.exists():
            total_size += filepath.stat().st_size
    
    print(f"   Generated {total_angles} images")
    print(f"   Total size: {total_size / 1024 / 1024:.2f} MB")
    print(f"   Location: {OUTPUT_DIR}")
    
    return True


def setup_hdri_lighting():
    """Optional: Setup HDRI lighting for professional results."""
    print("\n💡 Tip: For best results, use HDRI lighting")
    print("   1. World Properties → Use Background (HDRIs)")
    print("   2. Download from: https://ambientcg.com/ or https://hdri.cgaxis.com/")
    print("   3. Set strength to 1.0-2.0 for good exposure")


def validate_output():
    """Verify all images were rendered."""
    output_path = Path(OUTPUT_DIR)
    
    print(f"\n🔍 Verifying output...")
    
    files = list(output_path.glob(f"image_*.{IMAGE_FORMAT.lower()}"))
    expected = len(ROTATION_ANGLES)
    found = len(files)
    
    if found == expected:
        print(f"   ✅ All {expected} images rendered successfully!")
        return True
    else:
        print(f"   ⚠️  Found {found}/{expected} images")
        return False


def main():
    """Execute the script."""
    print("=" * 60)
    print("Blender 360° Portrait Rotation Renderer")
    print("=" * 60)
    
    # Create output directory
    create_output_directory()
    
    # Validate setup
    if not validate_setup():
        print("\n⚠️  Setup validation failed. Please check your scene.")
        setup_hdri_lighting()
        return
    
    # Configure render settings
    setup_render_settings()
    
    # Ask for confirmation
    print(f"\n📋 Configuration Summary:")
    print(f"   Head Object: {HEAD_OBJECT_NAME}")
    print(f"   Rotation Axis: {ROTATION_AXIS}")
    print(f"   Angles: {ROTATION_ANGLES[0]}° to {ROTATION_ANGLES[-1]}° ({len(ROTATION_ANGLES)} images)")
    print(f"   Resolution: {IMAGE_RESOLUTION[0]}x{IMAGE_RESOLUTION[1]}")
    print(f"   Output: {OUTPUT_DIR}")
    
    # Render
    if render_rotation_sequence():
        validate_output()
        print("\n✨ Done! Your images are ready for the portfolio website.")
    else:
        print("\n❌ Rendering failed. Check error messages above.")
    
    setup_hdri_lighting()


if __name__ == "__main__":
    # Run main function
    main()
