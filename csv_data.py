import pandas as pd
import pymongo


def main():
    record = get_records()
    try:
        file_path = "./uploads/" + record.encode('ascii')
        df = pd.read_csv("" + file_path + "")

        groupby_df = df.groupby(['R_fighter', 'B_fighter'])
        data = groupby_df.first()
        html = data.to_html()
        print("Converting dataframe to html")
        html_file = open("./views/output.html", "w")
        html_file.write(html)
        html_file.close()

    except:
        print("File not found")


def get_records():
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mydb"]
    mycol = mydb["files"]
    x = mycol.find_one()

    return x['address']



if __name__ == "__main__":
    main()
