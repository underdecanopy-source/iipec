from __future__ import annotations

import argparse
import json
import shutil
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageStat


LEADER_FILENAMES = {
    "Chap. Dr. E. O. Ige Olumide.jpg",
    "Chap. Dr. Isaac Apata.jpg",
    "Chap. Dr. Isaac Okpuzor.jpg",
    "Chap. Dr. Rebecca Okpuzor.jpg",
    "Chap. Oladipupo Abidoye.jpg",
    "Chap. Segun Ariyo.jpg",
    "Sir Herman Keck.jpg",
    "Sir. Ige Olumide.jpg",
}

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def image_files(images_dir: Path) -> list[Path]:
    return sorted(
        path
        for path in images_dir.iterdir()
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )


def backup_originals(files: list[Path], backup_dir: Path) -> None:
    backup_dir.mkdir(parents=True, exist_ok=True)
    for path in files:
        target = backup_dir / path.name
        if not target.exists():
            try:
                shutil.copy2(path, target)
            except FileNotFoundError as error:
                raise FileNotFoundError(f"Could not back up {path} to {target}") from error


def crop_leader_portrait(image: Image.Image) -> Image.Image:
    target_ratio = 4 / 5
    width, height = image.size
    current_ratio = width / height

    if abs(current_ratio - target_ratio) < 0.015:
        return image

    if current_ratio > target_ratio:
        new_width = int(height * target_ratio)
        left = max(0, (width - new_width) // 2)
        return image.crop((left, 0, left + new_width, height))

    new_height = int(width / target_ratio)
    top = max(0, int((height - new_height) * 0.42))
    return image.crop((0, top, width, top + new_height))


def enhance(source_path: Path, output_path: Path) -> dict[str, object]:
    is_leader = source_path.name in LEADER_FILENAMES

    with Image.open(source_path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        original_size = image.size

    if is_leader:
        image = crop_leader_portrait(image)

    image = ImageOps.autocontrast(image, cutoff=0.7 if is_leader else 0.5)

    mean_luma = ImageStat.Stat(image.convert("L").resize((1, 1))).mean[0]
    if mean_luma < 108:
        brightness = 1.07
    elif mean_luma > 188:
        brightness = 0.98
    else:
        brightness = 1.02

    image = ImageEnhance.Brightness(image).enhance(brightness)
    image = ImageEnhance.Contrast(image).enhance(1.09 if is_leader else 1.07)
    image = ImageEnhance.Color(image).enhance(1.03 if is_leader else 1.05)
    image = image.filter(
        ImageFilter.UnsharpMask(
            radius=1.0 if is_leader else 0.8,
            percent=95 if is_leader else 75,
            threshold=3,
        )
    )
    image = ImageEnhance.Sharpness(image).enhance(1.08 if is_leader else 1.04)

    save_kwargs = {"quality": 92, "optimize": True, "progressive": True}
    if output_path.suffix.lower() in {".png", ".webp"}:
        image.save(output_path)
    else:
        image.save(output_path, "JPEG", **save_kwargs)

    return {
        "file": source_path.name,
        "leader_portrait": is_leader,
        "original_size": original_size,
        "final_size": image.size,
    }


def make_contact_sheet(files: list[Path], output: Path, title: str) -> None:
    thumb_w, thumb_h = 210, 150
    label_h = 38
    padding = 14
    columns = 4
    rows = (len(files) + columns - 1) // columns
    sheet_w = columns * (thumb_w + padding) + padding
    sheet_h = 48 + rows * (thumb_h + label_h + padding) + padding

    sheet = Image.new("RGB", (sheet_w, sheet_h), "white")
    sheet.paste(Image.new("RGB", (sheet_w, 40), (31, 41, 55)), (0, 0))

    for index, path in enumerate(files):
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source).convert("RGB")
            image.thumbnail((thumb_w, thumb_h))
        x = padding + (index % columns) * (thumb_w + padding)
        y = 48 + (index // columns) * (thumb_h + label_h + padding)
        frame = Image.new("RGB", (thumb_w, thumb_h), (245, 245, 245))
        frame.paste(image, ((thumb_w - image.width) // 2, (thumb_h - image.height) // 2))
        sheet.paste(frame, (x, y))

    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, "JPEG", quality=88, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--images-dir", default="public/images")
    parser.add_argument("--source-dir")
    parser.add_argument("--contact-dir")
    args = parser.parse_args()

    images_dir = Path(args.images_dir)
    source_dir = Path(args.source_dir) if args.source_dir else images_dir
    files = image_files(source_dir)
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = images_dir / f"_originals_before_enhancement_{stamp}"

    if args.contact_dir:
        contact_dir = Path(args.contact_dir)
        make_contact_sheet(files, contact_dir / "before-enhancement.jpg", "Before")

    if source_dir == images_dir:
        backup_originals(files, backup_dir)
        backup_value = str(backup_dir)
    else:
        backup_value = str(source_dir)

    report = []
    for index, path in enumerate(files, start=1):
        report.append(enhance(path, images_dir / path.name))
        print(f"{index}/{len(files)} {path.name}", flush=True)

    if args.contact_dir:
        make_contact_sheet(files, Path(args.contact_dir) / "after-enhancement.jpg", "After")

    report_path = images_dir / "enhancement-report.json"
    report_path.write_text(json.dumps({"backup_source": backup_value, "images": report}, indent=2))
    print(f"Enhanced {len(report)} images")
    print(f"Backup/source: {backup_value}")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
