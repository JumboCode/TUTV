# This script generates django fixtures from the hold TUTV app json format
# Modify and run this script in case the django models change. Otherwise, 
# is sufficient to run ./manage.py loaddata api/fixture/fixture_to_import.json
# to populate a new sqlite database. 

import json

def main():
    categories = set()
    categories_with_pk = {}
    types = set()
    types_with_pk = {}
    fixtures = []        # a list of dictionaries
    f = open("tutv_unformatted.json", "r")
    json_parsed_f = json.load(f)
    f.close()

    
    for equipment_item in json_parsed_f:
        categories.add(equipment_item["cat"])
        types.add((equipment_item["type"], equipment_item["cat"])) # also save the category associated with that type
    
    # Generate category fixtures    
    for index, category in enumerate(categories):
        fixtures.append({"model": "api.equipmentcategory", "pk": index + 1, "fields": { "name": category }})
        categories_with_pk[category] = index + 1 # to be used for generating type fixtures

    # Generate types fixtures
    for index, equipment_type in enumerate(types):
        fixtures.append({ "model": "api.equipmenttype", "pk": index + 1, "fields": { "name": equipment_type[0], "category": categories_with_pk[equipment_type[1]] }})
        types_with_pk[equipment_type[0]] = index + 1

    # Generate items fixtures
    equipment_type_count = {} # keeps track of how many item we have of each type
    for index, equipment_item in enumerate(json_parsed_f):
        if equipment_item["type"] not in equipment_type_count:
            equipment_type_count[equipment_item["type"]] = 1
        else: 
            equipment_type_count[equipment_item["type"]] = equipment_type_count[equipment_item["type"]] + 1
        fixtures.append({ "model": "api.equipmentitem", "pk": index + 1, "fields": { "equipment_type": types_with_pk[equipment_item["type"]], "id_of_type": equipment_type_count[equipment_item["type"]], "comments": "", "created_at": "2019-11-25T22:54:51.566Z" }})
     

    # dump everything into a json
    fixtures_file = open("fixtures_from_old_data.json", "w")
    json.dump(fixtures, fixtures_file)
    
if __name__ == "__main__":
    main()