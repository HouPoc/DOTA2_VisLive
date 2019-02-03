import os

pathIconOnMap = 'assets/heroes/onMap'
pathIconOnPage = 'assets/heroes/onPage'

for filename in os.listdir(pathIconOnPage):
    newFilename = filename.replace("_icon", "").lower()
    print(filename, newFilename)
    os.rename(pathIconOnPage + '/' +filename, pathIconOnPage + '/' + newFilename)