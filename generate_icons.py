from PIL import Image, ImageDraw

def create_pwa_icon(size, filename):
    # Create image with dark gradient background
    img = Image.new('RGBA', (size, size), (9, 13, 22, 255))
    draw = ImageDraw.Draw(img)

    # Draw rounded rectangle / circle background
    margin = int(size * 0.05)
    center = size // 2
    radius = (size - 2 * margin) // 2

    # Outer cyan glow ring
    draw.ellipse([center - radius, center - radius, center + radius, center + radius], fill=(2, 132, 199, 255), outline=(56, 189, 248, 255), width=max(2, size // 64))

    # Water Drop Shape
    # Drop points: top peak, bottom rounded bulge
    top_y = int(size * 0.22)
    bottom_y = int(size * 0.78)
    drop_r = int(size * 0.22)

    # Draw drop bottom circle
    draw.ellipse([center - drop_r, bottom_y - 2 * drop_r, center + drop_r, bottom_y], fill=(255, 255, 255, 255))
    
    # Draw drop top triangle
    draw.polygon([(center, top_y), (center - drop_r + 2, bottom_y - drop_r), (center + drop_r - 2, bottom_y - drop_r)], fill=(255, 255, 255, 255))

    # Small inner cyan drop detail
    inner_r = int(drop_r * 0.4)
    draw.ellipse([center - inner_r, bottom_y - drop_r - inner_r, center + inner_r, bottom_y - drop_r + inner_r], fill=(56, 189, 248, 255))

    img.save(filename, 'PNG')
    print(f"Saved {filename} ({size}x{size})")

create_pwa_icon(192, 'public/icon-192.png')
create_pwa_icon(512, 'public/icon-512.png')
create_pwa_icon(192, 'public/apple-touch-icon.png')
