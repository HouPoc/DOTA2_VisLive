import json

pathToMapIcon =  "assets/heroes/onMap/"
pathToPageImage = "assets/heroes/onPage/"

with open("data/heroes.json", 'r') as data_file:
    data = json.load(data_file)
    
keys = data.keys()
j = 1
for i in keys:
    name = data[i]["localized_name"].lower()
    j += 1
    name = name.replace("-", "_")
    name = name.replace(" ", "_")
    data[i]["img"] = pathToPageImage + name + ".png";
    data[i]["icon"] = pathToMapIcon + name + ".png";
print (j)    
