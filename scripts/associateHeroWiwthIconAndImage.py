import json
import os

pathToMapIcon =  "assets/heroes/onMap/"
pathToPageImage = "assets/heroes/onPage/"

with open("data/heroes.json", 'r') as data_file:
    data = json.load(data_file)
    
keys = data.keys()
check = True

if ( not check):
    for i in keys:
        name = data[i]["localized_name"].lower()
        name = name.replace("-", "_")
        name = name.replace(" ", "_")
        data[i]["img"] = pathToPageImage + name + ".png";
        data[i]["icon"] = pathToMapIcon + name + ".png";

for i in keys:
    if (os.path.isfile(data[i]["img"]) and os.path.isfile(data[i]["icon"])):
        print (data[i]["localized_name"] + " image and icon linked.")
    else:
        print (data[i]["localized_name"] + " image or icon link failed.")
        print (data[i]["img"], data[i]["icon"])
        break
    

