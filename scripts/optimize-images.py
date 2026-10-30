#!/usr/bin/env python3
"""Convert remaining photographic assets to WebP/AVIF with responsive widths."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

WALLPAPERS = ROOT / "medha-frontend/src/assets/wallpapers"
SEMS_ASSETS = ROOT / "Sems/src/assets"

# Backgrounds can be slightly lossy; content photos stay a bit sharper.
WALLPAPER_WEBP_QUALITY = 72
PHOTO_WEBP_QUALITY = 78
PHOTO_AVIF_QUALITY = 50


def save_webp(image: Image.Image, dest: Path, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, "WEBP", quality=quality, method=6)


def save_avif(image: Image.Image, dest: Path, quality: int) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    image.save(dest, "AVIF", quality=quality)


def as_rgb(image: Image.Image) -> Image.Image:
    if image.mode in ("RGB", "L"):
        return image.convert("RGB")
    return image.convert("RGB")


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    if image.width <= width:
        return image
    height = max(1, round(image.height * (width / image.width)))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def convert_wallpapers() -> list[tuple[str, int, int]]:
    results = []
    for src in sorted(WALLPAPERS.glob("*.png")):
        image = as_rgb(Image.open(src))
        dest = src.with_suffix(".webp")
        before = src.stat().st_size
        save_webp(image, dest, WALLPAPER_WEBP_QUALITY)
        after = dest.stat().st_size
        src.unlink()
        results.append((src.name, before, after))
        print(f"wallpaper {src.name}: {before} -> {after} {dest.name}")
    return results


def convert_photo(src: Path, widths: tuple[int, ...]) -> None:
    if not src.exists():
        print(f"skip missing photo {src}")
        return
    image = as_rgb(Image.open(src))
    stem = src.stem
    for width in widths:
        resized = resize_to_width(image, width)
        webp = src.with_name(f"{stem}-{width}.webp")
        avif = src.with_name(f"{stem}-{width}.avif")
        save_webp(resized, webp, PHOTO_WEBP_QUALITY)
        save_avif(resized, avif, PHOTO_AVIF_QUALITY)
        print(
            f"photo {src.name}@{width}: "
            f"webp={webp.stat().st_size} avif={avif.stat().st_size}"
        )
    src.unlink()
    print(f"removed original {src}")


def main() -> int:
    if not WALLPAPERS.is_dir():
        print(f"missing wallpapers dir: {WALLPAPERS}", file=sys.stderr)
        return 1

    convert_wallpapers()
    convert_photo(SEMS_ASSETS / "hero-mockup.jpg", (640, 1024))
    convert_photo(SEMS_ASSETS / "feature-flashcards.jpg", (640, 1024))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
