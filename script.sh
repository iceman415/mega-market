#!/bin/bash

VEHICLES_FILE="data/vehicles.json"
PARTS_FILE="data/parts.json"
IMG_SRC_FILE=".img_src"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m'

BOLD='\033[1m'

ensure_files() {
    mkdir -p data public
    if [ ! -f "$VEHICLES_FILE" ]; then
        echo '[]' > "$VEHICLES_FILE"
    fi
    if [ ! -f "$PARTS_FILE" ]; then
        echo '[]' > "$PARTS_FILE"
    fi
}

ensure_img_src() {
    if [ -f "$IMG_SRC_FILE" ]; then
        IMG_SRC=$(cat "$IMG_SRC_FILE")
        if [ ! -d "$IMG_SRC" ]; then
            echo -e "${YELLOW}Warning: saved image source '$IMG_SRC' no longer exists.${NC}"
            echo -e "${YELLOW}Delete $IMG_SRC_FILE and re-run to set a new path.${NC}"
        fi
        return
    fi
    while true; do
        echo -e "${WHITE}Enter the full path of your image source directory:${NC}"
        read IMG_SRC
        IMG_SRC="${IMG_SRC/#\~/$HOME}"
        IMG_SRC="${IMG_SRC%/}"
        if [ -d "$IMG_SRC" ]; then
            echo "$IMG_SRC" > "$IMG_SRC_FILE"
            echo -e "${GREEN}Image source saved to $IMG_SRC_FILE${NC}"
            break
        else
            echo -e "${RED}Directory '$IMG_SRC' does not exist. Try again.${NC}"
        fi
    done
}

copy_image() {
    local src_path="$1"
    if [ ! -f "$IMG_SRC/$src_path" ]; then
        echo -e "${RED}Error: '$src_path' not found in $IMG_SRC${NC}" >&2
        return 1
    fi

    local webp_path="${src_path%.*}.webp"

    mkdir -p "public/$(dirname "$webp_path")"

    if ! command -v magick &>/dev/null; then
        echo -e "${YELLOW}Warning: ImageMagick not found, copying as-is.${NC}" >&2
        cp "$IMG_SRC/$src_path" "public/$src_path"
        echo "$src_path"
        return 0
    fi

    magick "$IMG_SRC/$src_path" -quality 85 -strip "public/$webp_path"
    echo -e "${GREEN}Optimized and copied '$webp_path' to public/${NC}" >&2
    echo "$webp_path"
    return 0
}

generate_id() {
    echo $(date +%s)$(shuf -i 100-999 -n 1)
}

json_escape() {
    echo "$1" | sed 's/"/\\"/g' | sed "s/'/\\'/g"
}

# ─── LIST ───────────────────────────────────────────────

list_vehicles() {
    echo -e "${CYAN}${BOLD}=== VEHICLES ===${NC}"
    python3 <<'PYEOF'
import json
with open("data/vehicles.json", "r") as f:
    vehicles = json.load(f)
if not vehicles:
    print("No vehicles found")
else:
    for v in vehicles:
        img_count = len(v.get("images", []))
        print(f"  ID: {v['id']}")
        print(f"  {v['brand']} {v['model']} ({v['year']})")
        print(f"  Price: ${v['price']} | Mileage: {v['mileage']} mi")
        print(f"  Images: {img_count} {'image' if img_count == 1 else 'images'}")
        print()
PYEOF
}

list_parts() {
    echo -e "${CYAN}${BOLD}=== PARTS ===${NC}"
    python3 <<'PYEOF'
import json
with open("data/parts.json", "r") as f:
    parts = json.load(f)
if not parts:
    print("No parts found")
else:
    for p in parts:
        img_count = len(p.get("images", []))
        print(f"  ID: {p['id']}")
        print(f"  {p['name']}")
        print(f"  Part#: {p['partNumber']} | {p['compatibility']}")
        print(f"  Price: ${p['price']}")
        print(f"  Images: {img_count} {'image' if img_count == 1 else 'images'}")
        print()
PYEOF
}

# ─── ADD VEHICLE ────────────────────────────────────────

add_vehicle() {
    ensure_files
    echo -e "${WHITE}Enter brand:${NC}"
    read brand
    while [ -z "$brand" ]; do
        echo -e "${RED}Brand cannot be empty${NC}"
        read brand
    done

    echo -e "${WHITE}Enter model:${NC}"
    read model
    while [ -z "$model" ]; do
        echo -e "${RED}Model cannot be empty${NC}"
        read model
    done

    echo -e "${WHITE}Enter year:${NC}"
    read year
    while [ -z "$year" ]; do
        echo -e "${RED}Year cannot be empty${NC}"
        read year
    done

    echo -e "${WHITE}Enter price (e.g., 25000.00):${NC}"
    read price
    while [ -z "$price" ]; do
        echo -e "${RED}Price cannot be empty${NC}"
        read price
    done

    echo -e "${WHITE}Enter mileage:${NC}"
    read mileage
    while [ -z "$mileage" ]; do
        echo -e "${RED}Mileage cannot be empty${NC}"
        read mileage
    done

    echo -e "${WHITE}Enter location (e.g., Miami, FL):${NC}"
    read location
    while [ -z "$location" ]; do
        echo -e "${RED}Location cannot be empty${NC}"
        read location
    done

    echo -e "${WHITE}Enter description:${NC}"
    read description
    while [ -z "$description" ]; do
        echo -e "${RED}Description cannot be empty${NC}"
        read description
    done

    echo -e "${WHITE}Enter main image filename (from source directory):${NC}"
    read main_image
    while [ -z "$main_image" ]; do
        echo -e "${RED}Image cannot be empty${NC}"
        read main_image
    done
    main_image="${main_image#/}"
    main_image=$(copy_image "$main_image") || return

    echo -e "${WHITE}Enter additional images (comma separated, or press Enter for none):${NC}"
    read additional

    id=$(generate_id)

    images_json="[\"/$main_image\""
    if [ -n "$additional" ]; then
        for img in $(echo "$additional" | tr ',' ' '); do
            img=$(echo "$img" | xargs)
            [ -z "$img" ] && continue
            img="${img#/}"
            img=$(copy_image "$img") || continue
            images_json="$images_json, \"/$img\""
        done
    fi
    images_json="$images_json]"

    python3 <<EOF
import json

new_vehicle = {
    "id": "$id",
    "brand": "$(json_escape "$brand")",
    "model": "$(json_escape "$model")",
    "year": "$(json_escape "$year")",
    "price": "$(json_escape "$price")",
    "mileage": "$(json_escape "$mileage")",
    "location": "$(json_escape "$location")",
    "description": "$(json_escape "$description")",
    "images": $images_json
}

with open("$VEHICLES_FILE", "r") as f:
    vehicles = json.load(f)

vehicles.append(new_vehicle)

with open("$VEHICLES_FILE", "w") as f:
    json.dump(vehicles, f, indent=2)
EOF
    echo -e "${GREEN}${BOLD}Vehicle added successfully! (ID: $id)${NC}"
}

# ─── ADD PART ───────────────────────────────────────────

add_part() {
    ensure_files
    echo -e "${WHITE}Enter part name:${NC}"
    read name
    while [ -z "$name" ]; do
        echo -e "${RED}Name cannot be empty${NC}"
        read name
    done

    echo -e "${WHITE}Enter part number:${NC}"
    read part_number
    while [ -z "$part_number" ]; do
        echo -e "${RED}Part number cannot be empty${NC}"
        read part_number
    done

    echo -e "${WHITE}Enter compatibility (e.g., Toyota Camry 2019-2023):${NC}"
    read compatibility
    while [ -z "$compatibility" ]; do
        echo -e "${RED}Compatibility cannot be empty${NC}"
        read compatibility
    done

    echo -e "${WHITE}Enter price (e.g., 189.99):${NC}"
    read price
    while [ -z "$price" ]; do
        echo -e "${RED}Price cannot be empty${NC}"
        read price
    done

    echo -e "${WHITE}Enter description:${NC}"
    read description
    while [ -z "$description" ]; do
        echo -e "${RED}Description cannot be empty${NC}"
        read description
    done

    echo -e "${WHITE}Enter location (e.g., Miami, FL):${NC}"
    read location
    while [ -z "$location" ]; do
        echo -e "${RED}Location cannot be empty${NC}"
        read location
    done

    echo -e "${WHITE}Enter main image filename (from source directory):${NC}"
    read main_image
    while [ -z "$main_image" ]; do
        echo -e "${RED}Image cannot be empty${NC}"
        read main_image
    done
    main_image="${main_image#/}"
    main_image=$(copy_image "$main_image") || return

    echo -e "${WHITE}Enter additional images (comma separated, or press Enter for none):${NC}"
    read additional

    id=$(generate_id)

    images_json="[\"/$main_image\""
    if [ -n "$additional" ]; then
        for img in $(echo "$additional" | tr ',' ' '); do
            img=$(echo "$img" | xargs)
            [ -z "$img" ] && continue
            img="${img#/}"
            img=$(copy_image "$img") || continue
            images_json="$images_json, \"/$img\""
        done
    fi
    images_json="$images_json]"

    python3 <<EOF
import json

new_part = {
    "id": "$id",
    "name": "$(json_escape "$name")",
    "partNumber": "$(json_escape "$part_number")",
    "compatibility": "$(json_escape "$compatibility")",
    "price": "$(json_escape "$price")",
    "description": "$(json_escape "$description")",
    "location": "$(json_escape "$location")",
    "images": $images_json
}

with open("$PARTS_FILE", "r") as f:
    parts = json.load(f)

parts.append(new_part)

with open("$PARTS_FILE", "w") as f:
    json.dump(parts, f, indent=2)
EOF
    echo -e "${GREEN}${BOLD}Part added successfully! (ID: $id)${NC}"
}

# ─── MANAGE IMAGES (generic helper) ─────────────────────

manage_images() {
    local data_file="$1"
    local item_type="$2"   # "vehicle" or "part"
    local id="$3"

    while true; do
        echo ""
        echo -e "${CYAN}${BOLD}--- Manage Images ---${NC}"
        python3 <<EOF
import json

with open("$data_file", "r") as f:
    items = json.load(f)

target = None
for item in items:
    if item["id"] == "$id":
        target = item
        break

if not target:
    print("Item not found!")
    exit()

images = target.get("images", [])
if not images:
    print("No images yet.")
else:
    for i, img in enumerate(images):
        label = " [MAIN]" if i == 0 else ""
        print(f"  [{i}] {img}{label}")
print()
EOF

        if [ $? -ne 0 ]; then
            return
        fi

        echo -e "${WHITE}Options:${NC}"
        echo -e "  ${GREEN}a${NC} - Add image(s)"
        echo -e "  ${YELLOW}r${NC} - Remove image by index"
        echo -e "  ${BLUE}s${NC} - Set main image (index 0)"
        echo -e "  ${RED}d${NC} - Done"
        echo ""
        echo -ne "Select: "
        read img_action

        case "$img_action" in
            a|A)
                echo -e "${WHITE}Enter image filenames to add (comma separated):${NC}"
                read new_imgs
                if [ -n "$new_imgs" ]; then
                    webp_paths=""
                    IFS=',' read -ra img_list <<< "$new_imgs"
                    for raw_fn in "${img_list[@]}"; do
                        fn=$(echo "$raw_fn" | xargs | sed 's/^\///')
                        [ -z "$fn" ] && continue
                        result=$(copy_image "$fn") || continue
                        if [ -n "$webp_paths" ]; then
                            webp_paths="$webp_paths,"
                        fi
                        webp_paths="${webp_paths}/$result"
                    done
                    if [ -n "$webp_paths" ]; then
                        python3 <<EOF
import json

filenames = "$webp_paths".split(",")

with open("$data_file", "r") as f:
    items = json.load(f)

for item in items:
    if item["id"] == "$id":
        if "images" not in item:
            item["images"] = []
        for fn in filenames:
            item["images"].append(fn)
        break

with open("$data_file", "w") as f:
    json.dump(items, f, indent=2)
EOF
                        echo -e "${GREEN}Image(s) added!${NC}"
                    fi
                fi
                ;;
            r|R)
                echo -e "${WHITE}Enter index to remove:${NC}"
                read idx
                if [[ "$idx" =~ ^[0-9]+$ ]]; then
                    python3 <<EOF
import json

with open("$data_file", "r") as f:
    items = json.load(f)

for item in items:
    if item["id"] == "$id":
        images = item.get("images", [])
        idx = int("$idx")
        if 0 <= idx < len(images):
            removed = images.pop(idx)
            print(f"Removed: {removed}")
        else:
            print("Invalid index!")
        break

with open("$data_file", "w") as f:
    json.dump(items, f, indent=2)
EOF
                else
                    echo -e "${RED}Invalid index!${NC}"
                fi
                ;;
            s|S)
                echo -e "${WHITE}Enter index to set as main image:${NC}"
                read idx
                if [[ "$idx" =~ ^[0-9]+$ ]]; then
                    python3 <<EOF
import json

with open("$data_file", "r") as f:
    items = json.load(f)

for item in items:
    if item["id"] == "$id":
        images = item.get("images", [])
        idx = int("$idx")
        if 0 <= idx < len(images):
            img = images.pop(idx)
            images.insert(0, img)
            print(f"Set as main: {img}")
        else:
            print("Invalid index!")
        break

with open("$data_file", "w") as f:
    json.dump(items, f, indent=2)
EOF
                else
                    echo -e "${RED}Invalid index!${NC}"
                fi
                ;;
            d|D|"")
                return
                ;;
            *)
                echo -e "${RED}Invalid option!${NC}"
                ;;
        esac
    done
}

# ─── UPDATE VEHICLE ─────────────────────────────────────

update_vehicle() {
    ensure_files
    list_vehicles

    if [ "$(cat "$VEHICLES_FILE")" = "[]" ]; then
        return
    fi

    echo -e "${WHITE}Enter vehicle ID to update:${NC}"
    read id
    while [ -z "$id" ]; do
        echo -e "${RED}ID cannot be empty${NC}"
        read id
    done

    while true; do
        echo ""
        echo -e "${WHITE}Field to update:${NC}"
        echo -e "  ${GREEN}1.${NC} Brand"
        echo -e "  ${GREEN}2.${NC} Model"
        echo -e "  ${GREEN}3.${NC} Year"
        echo -e "  ${GREEN}4.${NC} Price"
        echo -e "  ${GREEN}5.${NC} Mileage"
        echo -e "  ${GREEN}6.${NC} Description"
        echo -e "  ${GREEN}7.${NC} Location"
        echo -e "  ${YELLOW}8.${NC} Manage Images"
        echo -e "  ${RED}9.${NC} Done"
        echo ""
        echo -ne "Select: "
        read field_choice

        case "$field_choice" in
            1) field="brand" ;;
            2) field="model" ;;
            3) field="year" ;;
            4) field="price" ;;
            5) field="mileage" ;;
            6) field="description" ;;
            7) field="location" ;;
            8)
                manage_images "$VEHICLES_FILE" "vehicle" "$id"
                continue
                ;;
            9|"") return ;;
            *) echo -e "${RED}Invalid option!${NC}"; continue ;;
        esac

        echo -e "${WHITE}Enter new value:${NC}"
        read value
        while [ -z "$value" ]; do
            echo -e "${RED}Value cannot be empty${NC}"
            read value
        done

        python3 <<EOF
import json

with open("$VEHICLES_FILE", "r") as f:
    vehicles = json.load(f)

for v in vehicles:
    if v["id"] == "$id":
        v["$field"] = "$(json_escape "$value")"
        break

with open("$VEHICLES_FILE", "w") as f:
    json.dump(vehicles, f, indent=2)
EOF
        echo -e "${GREEN}Updated $field!${NC}"
    done
}

# ─── UPDATE PART ────────────────────────────────────────

update_part() {
    ensure_files
    list_parts

    if [ "$(cat "$PARTS_FILE")" = "[]" ]; then
        return
    fi

    echo -e "${WHITE}Enter part ID to update:${NC}"
    read id
    while [ -z "$id" ]; do
        echo -e "${RED}ID cannot be empty${NC}"
        read id
    done

    while true; do
        echo ""
        echo -e "${WHITE}Field to update:${NC}"
        echo -e "  ${GREEN}1.${NC} Name"
        echo -e "  ${GREEN}2.${NC} Part Number"
        echo -e "  ${GREEN}3.${NC} Compatibility"
        echo -e "  ${GREEN}4.${NC} Price"
        echo -e "  ${GREEN}5.${NC} Description"
        echo -e "  ${GREEN}6.${NC} Location"
        echo -e "  ${YELLOW}7.${NC} Manage Images"
        echo -e "  ${RED}8.${NC} Done"
        echo ""
        echo -ne "Select: "
        read field_choice

        case "$field_choice" in
            1) field="name" ;;
            2) field="partNumber" ;;
            3) field="compatibility" ;;
            4) field="price" ;;
            5) field="description" ;;
            6) field="location" ;;
            7)
                manage_images "$PARTS_FILE" "part" "$id"
                continue
                ;;
            8|"") return ;;
            *) echo -e "${RED}Invalid option!${NC}"; continue ;;
        esac

        echo -e "${WHITE}Enter new value:${NC}"
        read value
        while [ -z "$value" ]; do
            echo -e "${RED}Value cannot be empty${NC}"
            read value
        done

        python3 <<EOF
import json

with open("$PARTS_FILE", "r") as f:
    parts = json.load(f)

for p in parts:
    if p["id"] == "$id":
        p["$field"] = "$(json_escape "$value")"
        break

with open("$PARTS_FILE", "w") as f:
    json.dump(parts, f, indent=2)
EOF
        echo -e "${GREEN}Updated $field!${NC}"
    done
}

# ─── DELETE ─────────────────────────────────────────────

delete_vehicle() {
    ensure_files
    list_vehicles

    if [ "$(cat "$VEHICLES_FILE")" = "[]" ]; then
        return
    fi

    echo -e "${WHITE}Enter vehicle ID to delete:${NC}"
    read id
    while [ -z "$id" ]; do
        echo -e "${RED}ID cannot be empty${NC}"
        read id
    done

    python3 <<EOF
import json, os

with open("$VEHICLES_FILE", "r") as f:
    vehicles = json.load(f)

# Collect images before deleting
vehicle_images = []
for v in vehicles:
    if v["id"] == "$id":
        vehicle_images = v.get("images", [])
        break

before = len(vehicles)
vehicles = [v for v in vehicles if v["id"] != "$id"]

if len(vehicles) == before:
    print("Vehicle not found!")
else:
    with open("$VEHICLES_FILE", "w") as f:
        json.dump(vehicles, f, indent=2)
    # Delete associated images from public/
    for img_path in vehicle_images:
        img_file = img_path.lstrip("/")
        filepath = os.path.join("public", img_file)
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"Deleted image: public/{img_file}")
    print("Deleted!")
EOF
    echo -e "${GREEN}${BOLD}Vehicle deleted!${NC}"
}

delete_part() {
    ensure_files
    list_parts

    if [ "$(cat "$PARTS_FILE")" = "[]" ]; then
        return
    fi

    echo -e "${WHITE}Enter part ID to delete:${NC}"
    read id
    while [ -z "$id" ]; do
        echo -e "${RED}ID cannot be empty${NC}"
        read id
    done

    python3 <<EOF
import json, os

with open("$PARTS_FILE", "r") as f:
    parts = json.load(f)

# Collect images before deleting
part_images = []
for p in parts:
    if p["id"] == "$id":
        part_images = p.get("images", [])
        break

before = len(parts)
parts = [p for p in parts if p["id"] != "$id"]

if len(parts) == before:
    print("Part not found!")
else:
    with open("$PARTS_FILE", "w") as f:
        json.dump(parts, f, indent=2)
    # Delete associated images from public/
    for img_path in part_images:
        img_file = img_path.lstrip("/")
        filepath = os.path.join("public", img_file)
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"Deleted image: public/{img_file}")
    print("Deleted!")
EOF
    echo -e "${GREEN}${BOLD}Part deleted!${NC}"
}

# ─── MENUS ──────────────────────────────────────────────

show_main_menu() {
    echo ""
    echo -e "${MAGENTA}${BOLD}========================================${NC}"
    echo -e "${MAGENTA}${BOLD}     MEGA MARKET - DATA MANAGEMENT      ${NC}"
    echo -e "${MAGENTA}${BOLD}========================================${NC}"
    echo ""
    echo -e "${WHITE}${BOLD}1.${NC} ${CYAN}Vehicles${NC}"
    echo -e "${WHITE}${BOLD}2.${NC} ${CYAN}Parts${NC}"
    echo -e "${WHITE}${BOLD}3.${NC} ${RED}Exit${NC}"
    echo ""
    echo -ne "${WHITE}Select an option: ${NC}"
}

show_vehicles_menu() {
    echo ""
    echo -e "${BLUE}${BOLD}========================================${NC}"
    echo -e "${BLUE}${BOLD}          VEHICLES MENU               ${NC}"
    echo -e "${BLUE}${BOLD}========================================${NC}"
    echo ""
    echo -e "${WHITE}${BOLD}1.${NC} ${GREEN}List Vehicles${NC}"
    echo -e "${WHITE}${BOLD}2.${NC} ${GREEN}Add Vehicle${NC}"
    echo -e "${WHITE}${BOLD}3.${NC} ${YELLOW}Update Vehicle${NC}"
    echo -e "${WHITE}${BOLD}4.${NC} ${RED}Delete Vehicle${NC}"
    echo -e "${WHITE}${BOLD}5.${NC} ${CYAN}Back to Main Menu${NC}"
    echo ""
    echo -ne "${WHITE}Select an option: ${NC}"
}

show_parts_menu() {
    echo ""
    echo -e "${YELLOW}${BOLD}========================================${NC}"
    echo -e "${YELLOW}${BOLD}            PARTS MENU                 ${NC}"
    echo -e "${YELLOW}${BOLD}========================================${NC}"
    echo ""
    echo -e "${WHITE}${BOLD}1.${NC} ${GREEN}List Parts${NC}"
    echo -e "${WHITE}${BOLD}2.${NC} ${GREEN}Add Part${NC}"
    echo -e "${WHITE}${BOLD}3.${NC} ${YELLOW}Update Part${NC}"
    echo -e "${WHITE}${BOLD}4.${NC} ${RED}Delete Part${NC}"
    echo -e "${WHITE}${BOLD}5.${NC} ${CYAN}Back to Main Menu${NC}"
    echo ""
    echo -ne "${WHITE}Select an option: ${NC}"
}

vehicles_submenu() {
    while true; do
        show_vehicles_menu
        read option
        case $option in
            1) list_vehicles ;;
            2) add_vehicle ;;
            3) update_vehicle ;;
            4) delete_vehicle ;;
            5) break ;;
            *) echo -e "${RED}Invalid option!${NC}" ;;
        esac
    done
}

parts_submenu() {
    while true; do
        show_parts_menu
        read option
        case $option in
            1) list_parts ;;
            2) add_part ;;
            3) update_part ;;
            4) delete_part ;;
            5) break ;;
            *) echo -e "${RED}Invalid option!${NC}" ;;
        esac
    done
}

# ─── MAIN ───────────────────────────────────────────────

ensure_files
ensure_img_src

while true; do
    show_main_menu
    read option
    case $option in
        1) vehicles_submenu ;;
        2) parts_submenu ;;
        3) echo -e "${GREEN}Goodbye!${NC}"; exit 0 ;;
        *) echo -e "${RED}Invalid option!${NC}" ;;
    esac
done
