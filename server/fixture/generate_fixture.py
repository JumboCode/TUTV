# This script generates django fixtures from the old TUTV app json format
# Modify and run this script in case the django models change. Otherwise,
# is sufficient to run ./manage.py loaddata api/fixture/fixture_to_import.json
# to populate a new sqlite database.

import json

"""
Mapping from old data model to new data model:
Equipment Item (number) -> Equipment Instance
Equipment Type -> Equipment Item
Equipment Category -> Equipment Type
(Didn't previous exist) -> Equipment Category
"""

equipment_categories = ["Camera", "Lenses", "Audio", "Lighting", "Misc"]
equipment_categories_with_pk = {
    "Camera": 1,
    "Lenses": 2,
    "Audio": 3,
    "Lighting": 4,
    "Misc": 5,
}
equipment_category_to_types = {
    "Camera": ["Tripod", "T3i/T5i", "T7i", "Stabilizer"],
    "Lenses": ["Lens"],
    "Audio": [
        "AKG Microphone",
        "Headphones",
        "Audio Interface",
        "Shotgun Microphone",
        "Tascam",
        "Microphone",
    ],
    "Lighting": ["Stand", "Clamp", "Light"],
    "Misc": ["Cable", "Tape", "Hard Drive", "Memory Card", "Apple Box", "Slate", "Bag"],
}


def main():
    equipment_types = set()
    equipment_types_name_to_pk = {}  # mapping from name of type to its primary key
    equipment_items = set()
    equipment_items_name_to_pk = {}  # mapping from name of item to its primary key

    # a list of dictionaries, each is an entry to be added to a DB table
    fixtures = []

    # read in the old data
    f = open("tutv_unformatted.json", "r")
    json_parsed_f = json.load(f)
    f.close()

    # collect information on all possible types and items
    for equipment_instance in json_parsed_f:
        equipment_types.add(equipment_instance["cat"])
        # also save the type (used to be category) associated with that
        # instance (used to be item)
        equipment_items.add((equipment_instance["type"], equipment_instance["cat"]))

    # Generate category fixtures
    for index, category in enumerate(equipment_categories):
        fixtures.append(
            {
                "model": "api.equipmentcategory",
                "pk": index + 1,
                "fields": {"name": category},
            }
        )

    # Generate type fixtures
    for index, equipment_type in enumerate(equipment_types):
        FK_to_category = equipment_categories_with_pk[
            find_corresponding_category(equipment_type)
        ]
        fixtures.append(
            {
                "model": "api.equipmenttype",
                "pk": index + 1,
                "fields": {
                    "name": equipment_type,
                    "equipment_category_FK": FK_to_category,
                },
            }
        )
        # generate PKs for types that will be referenced when generating
        # item fixtures
        equipment_types_name_to_pk[equipment_type] = index + 1

    # Generate item fixtures
    for index, equipment_item in enumerate(equipment_items):
        name_of_item = equipment_item[0]
        type_of_item = equipment_item[1]

        FK_to_types = equipment_types_name_to_pk[type_of_item]
        fixtures.append(
            {
                "model": "api.equipmentitem",
                "pk": index + 1,
                "fields": {
                    "name": name_of_item,
                    "equipment_type_FK": FK_to_types,
                },
            }
        )
        # generate PKs for items that will be referenced when generating
        # instance fixtures
        equipment_items_name_to_pk[equipment_item[0]] = index + 1

    # Generate instance fixtures
    equipment_item_count = {}  # keeps track of how many item we have of each type
    for index, equipment_instance in enumerate(json_parsed_f):
        if equipment_instance["type"] not in equipment_item_count:
            equipment_item_count[equipment_instance["type"]] = 1
        else:
            equipment_item_count[equipment_instance["type"]] = (
                equipment_item_count[equipment_instance["type"]] + 1
            )
        fixtures.append(
            {
                "model": "api.equipmentinstance",
                "pk": index + 1,
                "fields": {
                    "equipment_item_FK": equipment_items_name_to_pk[
                        equipment_instance["type"]
                    ],
                    "id_of_item": equipment_item_count[equipment_instance["type"]],
                    "comments": "",
                    "created_at": "2019-11-25T22:54:51.566Z",
                },
            }
        )

    # dump everything into a json
    fixtures_file = open("fixtures_from_old_data_2021.json", "w")
    json.dump(fixtures, fixtures_file)


def find_corresponding_category(equipment_type):
    for category in equipment_category_to_types:
        if equipment_type in equipment_category_to_types[category]:
            return category
    raise Exception("No category found for type: " + equipment_type)


if __name__ == "__main__":
    main()
