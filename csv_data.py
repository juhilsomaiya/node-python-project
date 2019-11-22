import pandas as pd


def main():
    try:
        df = pd.read_csv("./uploads/input.csv")

        groupby_df = df.groupby(['R_fighter', 'B_fighter'])
        data = groupby_df.first()
        html = data.to_html()
        text_file = open("./views/output.html", "w")
        text_file.write(html)
        text_file.close()

        return True

    except:
        print("File not found")


if __name__ == "__main__":
    main()
