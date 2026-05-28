import os
import json


def safe_parse_json(value):
    """
    Tries to parse a stringified JSON field safely.
    If it's already an object, returns as-is.
    """
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def normalize_landing_point(lp):
    """
    Convert string fields into proper types.
    """
    return {
        "id": int(lp["id"]) if "id" in lp and lp["id"].isdigit() else lp.get("id"),
        "name": lp.get("name"),
        "latitude": float(lp["latitude"]) if lp.get("latitude") else None,
        "longitude": float(lp["longitude"]) if lp.get("longitude") else None,
    }


def transform_record(record):
    """
    Fixes the cable record.
    """

    # Parse description if it's stringified JSON
    description = record.get("description")

    parsed = safe_parse_json(description)

    # If description becomes a list of landing points, normalize them
    if isinstance(parsed, list):
        parsed = [normalize_landing_point(lp) for lp in parsed]

    record["description"] = parsed

    return record


def process_folder(input_folder, output_folder):
    os.makedirs(output_folder, exist_ok=True)

    for filename in os.listdir(input_folder):
        if not filename.endswith(".json"):
            continue

        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)

        with open(input_path, "r", encoding="utf-8") as f:
            record = json.load(f)

        cleaned = transform_record(record)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(cleaned, f, indent=2)

        print(f"Processed {filename}")


if __name__ == "__main__":
    INPUT_FOLDER = "./cables"
    OUTPUT_FOLDER = "./clean_cables"
    process_folder(INPUT_FOLDER, OUTPUT_FOLDER)