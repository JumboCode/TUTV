import json

def main():
    category = []
    with open("allequipment.json", "r") as f:
        json_parsed_f = json.load(f)
        # print(json_parsed_f)

        for dic in json_parsed_f:
            category.append(dic["cat"])
        print(list(set(category)))
        

if __name__ == "__main__":
    main()